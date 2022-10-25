use crate::{context::Context, prisma, users::auth::Auth, ws::Event};
use axum::{
    routing::{get, post},
    Json, Router,
};
use prisma_client_rust::Direction;
use serde::{Deserialize, Serialize};

pub fn routes() -> Router {
    Router::new()
        .route("/", get(get_threads))
        .route("/", post(create_thread))
}

async fn get_threads(_: Auth, context: Context) -> Json<Vec<ThreadResponse>> {
    let threads = context
        .prisma
        .thread()
        .find_many(vec![])
        .order_by(prisma::thread::id::order(Direction::Desc))
        .exec()
        .await
        .unwrap();

    let threads = threads.into_iter().map(Into::into).collect();

    Json(threads)
}

async fn create_thread(
    context: Context,
    Json(body): Json<CreateThreadBody>,
) -> Json<ThreadResponse> {
    let thread: ThreadResponse = context
        .prisma
        .thread()
        .create(body.name, vec![])
        .exec()
        .await
        .unwrap()
        .into();

    context
        .events
        .send(Event::ThreadCreated(thread.clone()))
        .unwrap();

    Json(thread)
}

#[derive(Debug, Clone, Deserialize)]
struct CreateThreadBody {
    name: String,
}

#[derive(Debug, Clone, Serialize)]
pub struct ThreadResponse {
    id: String,
    name: String,
}

impl From<prisma::thread::Data> for ThreadResponse {
    fn from(thread: prisma::thread::Data) -> Self {
        ThreadResponse {
            id: thread.id,
            name: thread.name,
        }
    }
}
