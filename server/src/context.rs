use crate::prisma::{self, PrismaClient};
use axum::{
    async_trait,
    extract::{FromRequest, RequestParts},
    Extension,
};
use clap::Parser;
use serde::Deserialize;
use std::{convert::Infallible, net::SocketAddr, path::PathBuf, sync::Arc};
use tokio::sync::broadcast::{self, Sender};

pub async fn create_context() -> Extension<Context> {
    let args = Args::parse();
    let config = tokio::fs::read_to_string(&args.config).await.unwrap();
    let config = Arc::new(serde_json::from_str(&config).unwrap());

    let prisma = Arc::new(prisma::new_client().await.unwrap());

    let (events, _) = broadcast::channel::<String>(100);

    Extension(Context {
        prisma,
        events,
        config,
    })
}

#[derive(Debug, Clone)]
pub struct Context {
    pub prisma: Arc<PrismaClient>,
    pub events: Sender<String>,
    pub config: Arc<Config>,
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
