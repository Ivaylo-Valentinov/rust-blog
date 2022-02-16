use actix_web::{web, HttpResponse};
use sqlx::PgPool;
use serde::{Serialize, Deserialize};

use crate::models::user::{User};
use crate::models::like::{Like};
use super::*;

#[derive(Debug, Deserialize, Serialize)]
pub struct LoginData {
  pub email: String,
  pub password: String
}

pub async fn like(
  db:   web::Data<PgPool>,
  user: User,
  path: web::Path<i32>
) -> HttpResponse {
  let web::Path(id) = path;

  send_json(Like::insert(&db, &user.id, &id).await)
}

pub async fn dislike(
  db:   web::Data<PgPool>,
  user: User,
  path: web::Path<i32>
) -> HttpResponse {
  let web::Path(id) = path;

  send_json(Like::delete(&db, &user.id, &id).await)
}
