mod prisma;
mod users;

use axum::{
    extract::{
        ws::{Message, WebSocketUpgrade},
        TypedHeader,
    },
    response::IntoResponse,
    routing::get,
    Extension, Router,
};
use futures_util::{stream::StreamExt, SinkExt};
use prisma::PrismaClient;
use std::{net::SocketAddr, sync::Arc};
use tokio::sync::broadcast::{self, Sender};
use tower_http::trace::TraceLayer;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

#[tokio::main]
async fn main() {
    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::new(
            std::env::var("RUST_LOG").unwrap_or_else(|_| "server=debug,tower_http=debug".into()),
        ))
        .with(tracing_subscriber::fmt::layer())
        .init();

    let client = Arc::new(prisma::new_client().await.unwrap());

    let (tx, _) = broadcast::channel::<String>(100);

    // build our application with some routes
    let app = Router::new()
        .route("/ws", get(ws_handler))
        .nest("/users", users::routes())
        // logging so we can see whats going on
        .layer(TraceLayer::new_for_http())
        .layer(Extension(client))
        .layer(Extension(tx));

    // run it with hyper
    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    tracing::debug!("listening on {}", addr);
    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}

async fn ws_handler(
    ws: WebSocketUpgrade,
    user_agent: Option<TypedHeader<headers::UserAgent>>,
    Extension(tx): Extension<Sender<String>>,
    Extension(client): Extension<Arc<PrismaClient>>,
) -> impl IntoResponse {
    if let Some(TypedHeader(user_agent)) = user_agent {
        println!("`{}` connected", user_agent.as_str());
    }

    ws.on_upgrade(|socket| async {
        // By splitting we can send and receive at the same time.
        let (mut sender, mut receiver) = socket.split();

        let mut rx = tx.subscribe();
        let mut send_task = tokio::spawn(async move {
            while let Ok(msg) = rx.recv().await {
                // In any websocket error, break loop.
                if sender.send(Message::Text(msg)).await.is_err() {
                    break;
                }
            }
        });

        // This task will receive messages from client and send them to broadcast subscribers.
        let mut recv_task = tokio::spawn(async move {
            while let Some(Ok(Message::Text(text))) = receiver.next().await {
                client
                    .message()
                    .create(text.clone(), vec![])
                    .exec()
                    .await
                    .unwrap();

                tx.send(text).unwrap();
            }
        });

        // If any one of the tasks exit, abort the other.
        tokio::select! {
            _ = (&mut send_task) => recv_task.abort(),
            _ = (&mut recv_task) => send_task.abort(),
        };
    })
}
