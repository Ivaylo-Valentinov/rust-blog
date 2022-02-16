use serde::{Serialize};
use actix_web::{error::ResponseError, HttpResponse};
use std::fmt;

#[derive(Debug, Serialize)]
pub struct Error {
  pub message: String
}

impl fmt::Display for Error {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    write!(f, "Error: {}", self.message)
  }
}

impl ResponseError for Error {
  fn error_response(&self) -> HttpResponse {
    HttpResponse::BadRequest().json(&self)
  }
}
