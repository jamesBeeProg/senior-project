mod context;
mod messages;
mod prisma;
mod threads;
mod users;
mod util;
mod ws;

use axum::{routing::get, Extension, Router};
use tower_http::{
    cors::{Any, CorsLayer},
    trace::TraceLayer,
};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

use crate::context::create_context;

fn base() -> Router {
    Router::new()
        .route("/ws", get(ws::ws_handler))
        .nest("/users", users::routes())
        .nest("/threads/:id/messages", messages::routes())
        .nest("/threads", threads::routes())
}

#[tokio::main]
async fn main() {
    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::new(
            std::env::var("RUST_LOG").unwrap_or_else(|_| "server=debug,tower_http=debug".into()),
        ))
        .with(tracing_subscriber::fmt::layer())
        .init();

    let context = create_context().await;

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_headers(Any)
        .allow_methods(Any);

    // Add base routes
    let app = base()
        // Provide the context
        .layer(Extension(context.clone()))
        // Add logging
        .layer(TraceLayer::new_for_http())
        .layer(cors);

    // Run it
    tracing::debug!("listening on {}", context.config.address);
    axum::Server::bind(&context.config.address)
        .serve(app.into_make_service())
        .await
        .unwrap();
}
