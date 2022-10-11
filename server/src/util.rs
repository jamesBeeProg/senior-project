use crate::prisma::PrismaClient;
use axum::{
    async_trait,
    extract::{FromRequest, RequestParts},
    Extension,
};
use std::{convert::Infallible, ops::Deref, sync::Arc};

pub struct Prisma(pub Arc<PrismaClient>);

impl Deref for Prisma {
    type Target = Arc<PrismaClient>;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

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
