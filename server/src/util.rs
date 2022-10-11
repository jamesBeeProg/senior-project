use crate::prisma::PrismaClient;
use axum::{
    async_trait,
    extract::{FromRequest, RequestParts},
    Extension,
};
use std::{convert::Infallible, sync::Arc};

pub struct Prisma(pub Arc<PrismaClient>);

#[async_trait]
impl<B: Send> FromRequest<B> for Prisma {
    type Rejection = Infallible;

    async fn from_request(req: &mut RequestParts<B>) -> Result<Self, Self::Rejection> {
        Ok(Prisma(
            Extension::<Arc<PrismaClient>>::from_request(req)
                .await
                .unwrap()
                .0,
        ))
    }
}
