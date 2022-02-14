use actix_web::{HttpResponse, Result};
use serde::{Serialize};
use http::StatusCode;

pub mod users;
use crate::error::{Error};

pub fn send_json(data: Result<impl Serialize, sqlx::Error>) -> HttpResponse {
  let error = Error {
    message: String::from("Something went wrong...")
  };

  match data {
      Ok(contents) => HttpResponse::Ok().json(contents),
      Err(_)       => HttpResponse::InternalServerError().json(error),
  }
}

pub async fn send_error(string: &str) -> Result<HttpResponse> {
  let error = Error {
    message: String::from(string)
  };

  Ok(HttpResponse::build(StatusCode::FORBIDDEN).json(error))
}
