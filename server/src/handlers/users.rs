use actix_web::{web, HttpResponse, Result};
use sqlx::PgPool;
// use futures_util::TryStreamExt as _;
use serde::{Serialize, Deserialize};

use crate::models::user::{NewUser, User};

#[derive(Debug, Deserialize, Serialize)]
pub struct LoginData {
  pub email: String,
  pub password: String
}

pub async fn register(
  db:   web::Data<PgPool>,
  form: web::Json<NewUser>
) -> Result<HttpResponse> {
  let new_user = form.into_inner();

  match new_user.insert(&db).await {
      Ok(smth) => {
          Ok(HttpResponse::Ok().json(smth))
      },
      Err(e) => Ok(HttpResponse::InternalServerError().body(format!("{}", e))),
  }
}

pub async fn login(
  db:   web::Data<PgPool>,
  form: web::Json<LoginData>
) -> Result<HttpResponse> {
  match User::login(&db, &form.email, &form.password).await {
      Ok(smth) => {
          Ok(HttpResponse::Ok().json(smth))
      },
      Err(e) => Ok(HttpResponse::InternalServerError().body(format!("{}", e))),
  }
}