use crate::prisma::PrismaClient;
use axum::{
    extract::{
        ws::{Message, WebSocketUpgrade},
        TypedHeader,
    },
    response::IntoResponse,
    Extension,
};
use futures_util::{stream::StreamExt, SinkExt};
use std::sync::Arc;
use tokio::sync::broadcast::Sender;

pub async fn ws_handler(
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
