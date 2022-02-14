use actix_web::web;

use crate::handlers;

pub fn configuration() -> Box<dyn Fn(&mut web::ServiceConfig)> {
    Box::new(|cfg: &mut web::ServiceConfig| {
        cfg.
            route("/users", web::post().to(handlers::users::register)).
            route("/auth", web::post().to(handlers::users::login));
    })
}