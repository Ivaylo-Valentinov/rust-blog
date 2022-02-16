use actix_web::{web, HttpResponse};
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
) -> HttpResponse {
  let new_user = form.into_inner();

  send_json(new_user.insert(&db).await)
}

pub async fn login(
  db:   web::Data<PgPool>,
  form: web::Json<LoginData>
) -> HttpResponse {
  match User::find_by_email(&db, &form.email).await {
    Ok(person) => {
      let valid = verify(&form.password, &person.password).unwrap();

      if !valid {
        return send_error("Invalid credentials!")
      }

      match person.set_auth_token(&db).await {
        Ok(_)  => send_json(User::find_by_email(&db, &form.email).await),
        Err(_) => send_error("Invalid credentials!")
      }
    },
    Err(_) => send_error("Invalid credentials!")
  }
}
