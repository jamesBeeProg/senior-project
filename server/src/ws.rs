use crate::{context::Context, messages::MessageResponse, threads::ThreadResponse};
use axum::{
    extract::ws::{Message, WebSocketUpgrade},
    response::IntoResponse,
};
use futures_util::{stream::StreamExt, SinkExt};
use serde::Serialize;

pub async fn ws_handler(ws: WebSocketUpgrade, context: Context) -> impl IntoResponse {
    ws.on_upgrade(|socket| async move {
        // By splitting we can send and receive at the same time.
        let (mut sender, mut receiver) = socket.split();

        let mut events = context.events.subscribe();
        let mut send_task = tokio::spawn(async move {
            while let Ok(event) = events.recv().await {
                let message = Message::Text(serde_json::to_string(&event).unwrap());
                // In any websocket error, break loop.
                if sender.send(message).await.is_err() {
                    break;
                }
            }
        });

        // This task will receive messages from client and send them to broadcast subscribers.
        let mut recv_task = tokio::spawn(async move {
            while let Some(Ok(Message::Text(text))) = receiver.next().await {
                dbg!(text);
            }
        });

        // If any one of the tasks exit, abort the other.
        tokio::select! {
            _ = (&mut send_task) => recv_task.abort(),
            _ = (&mut recv_task) => send_task.abort(),
        };
    })
}

#[derive(Debug, Clone, Serialize)]
#[serde(tag = "e", content = "c")]
#[serde(rename_all = "snake_case")]
pub enum Event {
    MessageCreated(MessageResponse),
    ThreadCreated(ThreadResponse),
}
