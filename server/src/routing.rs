use actix_web::web;

use crate::handlers;

pub fn configuration() -> Box<dyn Fn(&mut web::ServiceConfig)> {
  Box::new(|cfg: &mut web::ServiceConfig| {
    cfg.
      route("/users", web::post().to(handlers::users::register)).
      route("/auth", web::post().to(handlers::users::login)).
      route("/drafts/{id}", web::get().to(handlers::blogs::get_draft_blog)). //Get draft post
      route("/drafts", web::get().to(handlers::blogs::get_drafts_paginated)). //Get paginated list of draft posts
      service(
        web::resource("/posts/{id}").
        route(web::get().to(handlers::blogs::get_published_blog)). //Get published post
        route(web::post().to(handlers::blogs::publish)) //Publish draft post
      ).
      route("/post/{id}/edit", web::post().to(handlers::blogs::something)). //Add new paragraphs
      service(
        web::resource("/posts").
        route(web::get().to(handlers::blogs::get_published_paginated)). //Get paginated list of blogs and search
        route(web::post().to(handlers::blogs::create_new_draft)) //Create draft post
      ).
      service(
        web::resource("/posts/{id}/likes").
        route(web::post().to(handlers::likes::like)). //Like
        route(web::delete().to(handlers::likes::dislike)) //Dislike
      ).
      service(
        web::resource("/comments").
        route(web::get().to(handlers::comments::get_paginated_comments)). //Get paginated comments
        route(web::post().to(handlers::comments::create_new_comment)) //Add comment
      ).
      route("/comments/{id}", web::delete().to(handlers::blogs::something)). //Delete comment
      route("/posts/{id}/draft", web::post().to(handlers::blogs::update_new_draft)); //Save draft post
  })
}
