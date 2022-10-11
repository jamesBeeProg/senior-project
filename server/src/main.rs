mod context;
mod prisma;
mod users;
mod ws;

use axum::{routing::get, Router};
use std::net::SocketAddr;
use tower_http::trace::TraceLayer;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

use crate::context::create_context;

fn base() -> Router {
    Router::new()
        .route("/ws", get(ws::ws_handler))
        .nest("/users", users::routes())
}

#[tokio::main]
async fn main() {
    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::new(
            std::env::var("RUST_LOG").unwrap_or_else(|_| "server=debug,tower_http=debug".into()),
        ))
        .with(tracing_subscriber::fmt::layer())
        .init();

    // Add base routes
    let app = base()
        // Provide the context
        .layer(create_context().await)
        // Add logging
        .layer(TraceLayer::new_for_http());

    // Run it
    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    tracing::debug!("listening on {}", addr);
    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}
