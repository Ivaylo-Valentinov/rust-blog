use actix_web::{HttpResponse};
use serde::{Serialize};
use http::StatusCode;

pub mod users;
pub mod blogs;
use crate::error::{Error};

pub fn send_json(data: Result<impl Serialize, sqlx::Error>) -> HttpResponse {
  let error = Error {
    message: String::from("Something went wrong...")
  };

  match data {
      Ok(contents) => HttpResponse::Ok().json(contents),
      Err(_)       => HttpResponse::InternalServerError().json(error)
  }
}

pub fn send_error(string: &str) -> HttpResponse{
  let error = Error {
    message: String::from(string)
  };

  HttpResponse::build(StatusCode::FORBIDDEN).json(error)
}
