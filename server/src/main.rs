mod prisma;
mod users;
mod ws;

use axum::{routing::get, Extension, Router};
use std::{net::SocketAddr, sync::Arc};
use tokio::sync::broadcast::{self};
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
        .route("/ws", get(ws::ws_handler))
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
