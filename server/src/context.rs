use crate::prisma::{self, PrismaClient};
use axum::{
    async_trait,
    extract::{FromRequest, RequestParts},
    Extension,
};
use clap::Parser;
use serde::Deserialize;
use std::{convert::Infallible, net::SocketAddr, ops::Deref, path::PathBuf, sync::Arc};
use tokio::sync::broadcast::{self, Sender};

pub async fn create_context() -> Context {
    let args = Args::parse();
    let config = tokio::fs::read_to_string(&args.config).await.unwrap();
    let config = serde_json::from_str(&config).unwrap();

    let prisma = prisma::new_client().await.unwrap();

    let (events, _) = broadcast::channel::<String>(100);

    Context(Arc::new(InnerContext {
        prisma,
        events,
        config,
    }))
}

#[derive(Debug)]
pub struct InnerContext {
    pub prisma: PrismaClient,
    pub events: Sender<String>,
    pub config: Config,
}

#[derive(Debug, Clone)]
pub struct Context(Arc<InnerContext>);

impl Deref for Context {
    type Target = InnerContext;
    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

#[async_trait]
impl<B: Send> FromRequest<B> for Context {
    type Rejection = Infallible;

    async fn from_request(req: &mut RequestParts<B>) -> Result<Self, Self::Rejection> {
        Ok(Extension::<Context>::from_request(req).await.unwrap().0)
    }
}

#[derive(Debug, Parser)]
pub struct Args {
    #[clap(default_value = "default_config.json")]
    pub config: PathBuf,
}

#[derive(Debug, Deserialize)]
pub struct Config {
    pub token_secret: String,
    pub address: SocketAddr,
    pub operators: Vec<String>,
}
