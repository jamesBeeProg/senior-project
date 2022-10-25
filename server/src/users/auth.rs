use crate::{context::Context, prisma};
use axum::{
    async_trait,
    extract::{FromRequest, RequestParts, TypedHeader},
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};
use headers::{authorization::Bearer, Authorization};
use jsonwebtoken::{
    errors::Result as JWTResult, DecodingKey, EncodingKey, Header, TokenData, Validation,
};
use serde::{Deserialize, Serialize};
use std::ops::Deref;

#[derive(Debug, Serialize, Deserialize)]
struct Claims {
    sub: String,
}

pub fn encode_token(user_id: String, token_secret: &str) -> String {
    let secret = EncodingKey::from_base64_secret(token_secret).unwrap();
    jsonwebtoken::encode(&Header::default(), &Claims { sub: user_id }, &secret).unwrap()
}

fn decode_token(token: &str, token_secret: &str) -> JWTResult<TokenData<Claims>> {
    let secret = DecodingKey::from_base64_secret(token_secret).unwrap();
    let mut validation = Validation::default();
    validation.set_required_spec_claims(&["sub"]);

    jsonwebtoken::decode::<Claims>(token, &secret, &validation)
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
        let TypedHeader(Authorization(bearer)) =
            TypedHeader::<Authorization<Bearer>>::from_request(req)
                .await
                .map_err(|err| err.into_response())?;

        let context = Context::from_request(req).await.unwrap();

        let token = decode_token(bearer.token(), &context.config.token_secret)
            .map_err(|_| (StatusCode::UNAUTHORIZED, Json("Invalid token")).into_response())?;

        // Fetch the user
        let user = context
            .prisma
            .user()
            .find_unique(prisma::user::id::equals(token.claims.sub))
            .exec()
            .await
            .unwrap()
            .ok_or_else(|| (StatusCode::UNAUTHORIZED, Json("Invalid user")).into_response())?;

        Ok(Auth(user))
    }
}
