use actix_web::{web, App, HttpServer, HttpResponse};
use actix_cors::Cors;
use sqlx::PgPool;
use dotenv::dotenv;

use server::routing;

#[actix_rt::main]
async fn main() -> std::io::Result<()> {
  dotenv().ok();

  let database_url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");
  let db = PgPool::connect(&database_url).
    await.
    unwrap_or_else(|_| panic!("Error connecting to {}", database_url));
  let db = web::Data::new(db);

  let server = HttpServer::new(move || {
    App::new().
    wrap(Cors::default().allow_any_origin().allow_any_method().allow_any_header()).
    configure(routing::configuration()).
    app_data(db.clone()).
    default_service(
      web::resource("").
      route(web::route().to(HttpResponse::MethodNotAllowed))
    )
  });

  let addr = "127.0.0.1:7000";
  println!("Listening for requests at http://{}", addr);
  server.bind(addr)?.run().await
}
