use crate::{context::Context, prisma};
use axum::{
    async_trait,
    extract::{FromRequest, RequestParts, TypedHeader},
    http::StatusCode,
    response::{IntoResponse, Response},
};
use headers::{authorization::Bearer, Authorization};
use jsonwebtoken::{DecodingKey, Validation};
use serde::{Deserialize, Serialize};
use std::ops::Deref;

#[derive(Debug, Serialize, Deserialize)]
struct Claims {
    sub: String,
}

pub struct Auth(pub prisma::user::Data);

impl Deref for Auth {
    type Target = prisma::user::Data;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

#[async_trait]
impl<B: Send> FromRequest<B> for Auth {
    type Rejection = Response;

    async fn from_request(req: &mut RequestParts<B>) -> Result<Self, Self::Rejection> {
        // Get the request's Authorization header
        let TypedHeader(Authorization(token)) =
            TypedHeader::<Authorization<Bearer>>::from_request(req)
                .await
                .map_err(|err| err.into_response())?;

        let context = Context::from_request(req).await.unwrap();

        let secret = DecodingKey::from_base64_secret(&context.config.token_secret).unwrap();
        let mut validation = Validation::default();
        validation.set_required_spec_claims(&["sub"]);

        // Get the data from the token
        let token = jsonwebtoken::decode::<Claims>(token.token(), &secret, &validation)
            .map_err(|_| (StatusCode::UNAUTHORIZED, "Invalid token").into_response())?;

        // Fetch the user
        let user = context
            .prisma
            .user()
            .find_unique(prisma::user::id::equals(token.claims.sub))
            .exec()
            .await
            .unwrap()
            .ok_or_else(|| (StatusCode::UNAUTHORIZED, "Invalid user").into_response())?;

        Ok(Auth(user))
    }
}
