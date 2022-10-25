use crate::{
    context::Context,
    prisma,
    users::{auth::Auth, UserResponse},
    ws::Event,
};
use axum::{
    extract::Path,
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

async fn get_messages(
    _: Auth,
    context: Context,
    Path(thread_id): Path<String>,
) -> Json<Vec<MessageResponse>> {
    let messages = context
        .prisma
        .message()
        .find_many(vec![prisma::message::thread_id::equals(thread_id)])
        .order_by(prisma::message::id::order(Direction::Desc))
        .take(20)
        .with(prisma::message::author::fetch())
        .exec()
        .await
        .unwrap();

    let messages = messages.into_iter().map(Into::into).collect();

    Json(messages)
}

async fn send_message(
    Auth(author): Auth,
    context: Context,
    Json(body): Json<SendMessageBody>,
    Path(thread_id): Path<String>,
) -> Json<MessageResponse> {
    dbg!(&thread_id, &body);
    let message: MessageResponse = context
        .prisma
        .message()
        .create(
            body.content,
            prisma::thread::id::equals(thread_id),
            vec![prisma::message::author::connect(prisma::user::id::equals(
                author.id,
            ))],
        )
        .with(prisma::message::author::fetch())
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
    author: Option<UserResponse>,
    thread_id: String,
}

impl From<prisma::message::Data> for MessageResponse {
    fn from(message: prisma::message::Data) -> Self {
        MessageResponse {
            id: message.id,
            content: message.content,
            author: message.author.unwrap().map(|data| (*data).into()),
            thread_id: message.thread_id,
        }
    }
}
