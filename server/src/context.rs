use crate::prisma::{self, PrismaClient};
use axum::{
    async_trait,
    extract::{FromRequest, RequestParts},
    Extension,
};
use std::{convert::Infallible, sync::Arc};
use tokio::sync::broadcast::{self, Sender};

pub async fn create_context() -> Extension<Context> {
    let prisma = Arc::new(prisma::new_client().await.unwrap());

    let (events, _) = broadcast::channel::<String>(100);

    Extension(Context { prisma, events })
}

#[derive(Debug, Clone)]
pub struct Context {
    pub prisma: Arc<PrismaClient>,
    pub events: Sender<String>,
}

#[async_trait]
impl<B: Send> FromRequest<B> for Context {
    type Rejection = Infallible;

    async fn from_request(req: &mut RequestParts<B>) -> Result<Self, Self::Rejection> {
        Ok(Extension::<Context>::from_request(req).await.unwrap().0)
    }
}
