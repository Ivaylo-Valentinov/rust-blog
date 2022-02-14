use actix_web::{web, HttpResponse, Result};
use sqlx::PgPool;
use serde::{Serialize, Deserialize};
use bcrypt::{verify};

use crate::models::user::{NewUser, User};
use super::*;

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
  match User::find_by_email(&db, &form.email).await {
    Ok(person) => {
      let valid = verify(&form.password, &person.password).unwrap();

      if !valid {
        return send_error("Invalid credentials!").await
      }

      match person.set_auth_token(&db).await {
        Ok(_)  => Ok(send_json(User::find_by_email(&db, &form.email).await)),
        Err(_) => send_error("Invalid credentials!").await
      }
    },
    Err(_) => send_error("Invalid credentials!").await
  }
}