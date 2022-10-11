use crate::{
    prisma::{self, PrismaClient},
    util::Prisma,
};
use axum::{
    async_trait,
    extract::{FromRequest, Path, RequestParts, TypedHeader},
    http::StatusCode,
    response::{IntoResponse, Response},
    routing::{get, post},
    Extension, Json, Router,
};
use headers::{authorization::Bearer, Authorization};
use jsonwebtoken::{DecodingKey, Validation};
use serde::{Deserialize, Serialize};
use std::sync::Arc;

pub fn routes() -> Router {
    Router::new()
        .route("/@me", get(get_me))
        .route("/:id", get(get_id))
        .route("/", post(create))
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

async fn get_me(Auth(user): Auth) -> Json<UserResponse> {
    user.into()
}

async fn get_id(
    _: Auth,
    Prisma(prisma): Prisma,
    Path(id): Path<String>,
) -> Result<Json<UserResponse>, StatusCode> {
    prisma
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

async fn create(
    _: Auth,
    Prisma(prisma): Prisma,
    Json(user): Json<CreateBody>,
) -> Json<UserResponse> {
    prisma
        .user()
        .create(user.name, vec![])
        .exec()
        .await
        .unwrap()
        .into()
}

const SECRET_KEY: &[u8] = b"TODO";

#[derive(Debug, Serialize, Deserialize)]
struct Claims {
    sub: String,
}

struct Auth(prisma::user::Data);

#[async_trait]
impl<B: Send> FromRequest<B> for Auth {
    type Rejection = Response;

    async fn from_request(req: &mut RequestParts<B>) -> Result<Self, Self::Rejection> {
        // Get the request's Authorization header
        let TypedHeader(Authorization(token)) =
            TypedHeader::<Authorization<Bearer>>::from_request(req)
                .await
                .map_err(|err| err.into_response())?;

        let mut validation = Validation::default();
        validation.set_required_spec_claims(&["sub"]);

        // Get the data from the token
        let token = jsonwebtoken::decode::<Claims>(
            token.token(),
            &DecodingKey::from_secret(SECRET_KEY),
            &validation,
        )
        .map_err(|error| {
            dbg!(error);
            (StatusCode::UNAUTHORIZED, "Invalid token").into_response()
        })?;

        let Extension(prisma) = Extension::<Arc<PrismaClient>>::from_request(req)
            .await
            .unwrap();

        // Fetch the user
        let user = prisma
            .user()
            .find_unique(prisma::user::id::equals(token.claims.sub))
            .exec()
            .await
            .unwrap()
            .ok_or_else(|| (StatusCode::UNAUTHORIZED, "Invalid user").into_response())?;

        Ok(Auth(user))
    }
}
