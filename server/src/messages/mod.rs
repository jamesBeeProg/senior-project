use crate::{context::Context, prisma, ws::Event};
use axum::{
    routing::{get, post},
    Json, Router,
};
use prisma_client_rust::Direction;
use serde::{Deserialize, Serialize};

pub fn routes() -> Router {
    Router::new()
        .route("/", get(get_messages))
        .route("/", post(send_message))
}

async fn get_messages(context: Context) -> Json<Vec<MessageResponse>> {
    let messages = context
        .prisma
        .message()
        .find_many(vec![])
        .order_by(prisma::message::id::order(Direction::Desc))
        .take(20)
        .exec()
        .await
        .unwrap();

    let messages = messages.into_iter().map(Into::into).collect();

    Json(messages)
}

async fn send_message(
    context: Context,
    Json(body): Json<SendMessageBody>,
) -> Json<MessageResponse> {
    let message: MessageResponse = context
        .prisma
        .message()
        .create(body.content, vec![])
        .exec()
        .await
        .unwrap()
        .into();

    context
        .events
        .send(Event::MessageCreated(message.clone()))
        .unwrap();

    Json(message)
}

#[derive(Debug, Clone, Deserialize)]
struct SendMessageBody {
    content: String,
}

#[derive(Debug, Clone, Serialize)]
pub struct MessageResponse {
    id: String,
    content: String,
}

impl From<prisma::message::Data> for MessageResponse {
    fn from(message: prisma::message::Data) -> Self {
        MessageResponse {
            id: message.id,
            content: message.content,
        }
    }
}
