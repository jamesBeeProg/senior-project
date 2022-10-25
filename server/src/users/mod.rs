pub mod auth;

use crate::{context::Context, prisma};
use axum::{
    extract::Path,
    http::StatusCode,
    routing::{get, post},
    Json, Router,
};
use serde::{Deserialize, Serialize};

use self::auth::{encode_token, Auth};

pub fn routes() -> Router {
    Router::new()
        .route("/@me", get(me))
        .route("/:id", get(id))
        .route("/", post(create))
        .route("/:id/token", get(token))
}

async fn token(context: Context, Path(user_id): Path<String>) -> String {
    encode_token(user_id, &context.config.token_secret)
}

async fn me(Auth(user): Auth) -> Json<UserResponse> {
    user.into()
}

async fn id(
    _: Auth,
    context: Context,
    Path(id): Path<String>,
) -> Result<Json<UserResponse>, StatusCode> {
    context
        .prisma
        .user()
        .find_unique(prisma::user::id::equals(id))
        .exec()
        .await
        .unwrap()
        .map(|user| user.into())
        .ok_or(StatusCode::NOT_FOUND)
}

#[derive(Debug, Deserialize)]
struct CreateBody {
    name: String,
}

async fn create(_: Auth, context: Context, Json(user): Json<CreateBody>) -> Json<UserResponse> {
    context
        .prisma
        .user()
        .create(user.name, vec![])
        .exec()
        .await
        .unwrap()
        .into()
}

#[derive(Debug, Serialize)]
struct UserResponse {
    id: String,
    name: String,
}

impl From<prisma::user::Data> for Json<UserResponse> {
    fn from(user: prisma::user::Data) -> Self {
        Json(UserResponse {
            id: user.id,
            name: user.name,
        })
    }
}
