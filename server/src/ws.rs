use crate::context::Context;
use axum::{
    extract::ws::{Message, WebSocketUpgrade},
    response::IntoResponse,
};
use futures_util::{stream::StreamExt, SinkExt};

pub async fn ws_handler(ws: WebSocketUpgrade, context: Context) -> impl IntoResponse {
    ws.on_upgrade(|socket| async {
        // By splitting we can send and receive at the same time.
        let (mut sender, mut receiver) = socket.split();

        let mut events = context.events.subscribe();
        let mut send_task = tokio::spawn(async move {
            while let Ok(msg) = events.recv().await {
                // In any websocket error, break loop.
                if sender.send(Message::Text(msg)).await.is_err() {
                    break;
                }
            }
        });

        // This task will receive messages from client and send them to broadcast subscribers.
        let mut recv_task = tokio::spawn(async move {
            while let Some(Ok(Message::Text(text))) = receiver.next().await {
                context
                    .prisma
                    .message()
                    .create(text.clone(), vec![])
                    .exec()
                    .await
                    .unwrap();

                context.events.send(text).unwrap();
            }
        });

        // If any one of the tasks exit, abort the other.
        tokio::select! {
            _ = (&mut send_task) => recv_task.abort(),
            _ = (&mut recv_task) => send_task.abort(),
        };
    })
}
