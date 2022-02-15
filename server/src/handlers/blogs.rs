use actix_web::{web, HttpResponse, Result};
use sqlx::PgPool;
// use serde::{Serialize, Deserialize};

use crate::models::user::{User};
use crate::models::blog::{NewDraft, Blog};
use super::*;

pub async fn create_new_draft(
  db:   web::Data<PgPool>,
  user: User,
  form: web::Json<NewDraft>
) -> Result<HttpResponse> {
  let new_draft = form.into_inner();

  send_json(new_draft.insert(&db, &user).await)
}

pub async fn update_new_draft(
  db:   web::Data<PgPool>,
  user: User,
  path: web::Path<i32>,
  form: web::Json<NewDraft>
) -> Result<HttpResponse> {
  let new_draft = form.into_inner();
  let web::Path(id) = path;

  let blog = Blog::find_by_id(&db, &id).await;

  if let Err(_) = blog {
    return send_error("Not valid id!").await
  }

  let blog = blog.unwrap();

  if !blog.is_draft {
    return send_error("Cannot edit published blog posts!").await
  }

  if blog.added_by != user.id {
    return send_error("Cannot edit drafts you don't own!").await
  }

  send_json(blog.update(&db, &new_draft).await)
}

pub async fn get_published_blog(
  db:   web::Data<PgPool>,
  _: User,
  path: web::Path<i32>
) -> Result<HttpResponse> {
  let web::Path(id) = path;

  let blog = Blog::find_by_id(&db, &id).await;

  if let Err(_) = blog {
    return send_error("Not valid id!").await
  }

  let blog = blog.unwrap();

  if blog.is_draft {
    return send_error("This is not a published post!").await
  }

  send_json(Ok(blog))
}

pub async fn get_draft_blog(
  db:   web::Data<PgPool>,
  user: User,
  path: web::Path<i32>
) -> Result<HttpResponse> {
  let web::Path(id) = path;

  let blog = Blog::find_by_id(&db, &id).await;

  if let Err(_) = blog {
    return send_error("Not valid id!").await
  }

  let blog = blog.unwrap();

  if !blog.is_draft {
    return send_error("This is a published post!").await
  }

  if blog.added_by != user.id {
    return send_error("Cannot see drafts you don't own!").await
  }

  send_json(Ok(blog))
}

pub async fn something(
  _db:   web::Data<PgPool>,
  user: User
) -> Result<HttpResponse> {
  send_json(Ok(&user))
}
