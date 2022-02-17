use actix_web::{web, HttpResponse};
use sqlx::PgPool;
use serde::{Deserialize};

use crate::models::user::{User};
use crate::models::comment::{NewComment, Comment};
use super::*;

#[derive(Debug, Deserialize)]
pub struct Pagination {
  pub blog_id: i32,
  pub paragraph_id: Option<i32>,
  pub page_number: i32,
  pub page_size: i32
}

pub async fn create_new_comment(
  db:   web::Data<PgPool>,
  user: User,
  form: web::Json<NewComment>
) -> HttpResponse {
  let new_comment = form.into_inner();

  send_json(new_comment.insert(&db, &user).await)
}

pub async fn get_paginated_comments(
  db:     web::Data<PgPool>,
  _:      User,
  params: web::Query<Pagination>
) -> HttpResponse {
  let pagination = params.into_inner();

  send_json(Comment::get_all_comments(
    &db,
    &pagination.blog_id,
    &pagination.paragraph_id,
    &pagination.page_number,
    &pagination.page_size
  ).await)
}
