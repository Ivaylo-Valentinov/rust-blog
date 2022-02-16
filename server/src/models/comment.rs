use chrono::{DateTime, Local};
use sqlx::{PgPool, Row};
use serde::{Serialize, Deserialize};

#[derive(Debug, sqlx::FromRow, Serialize, Deserialize)]
pub struct Comment {
  pub id: i32,
  pub user_id: i32,
  pub blog_id: i32,
  pub paragraph_id: Option<i32>,
  pub text: String,
  pub created_at: DateTime<Local>
}

#[derive(Debug, Serialize)]
pub struct PaginatedBlogs {
  pub results: Vec<Comment>,
  pub total: i64
}

#[derive(Debug, Deserialize, Serialize)]
pub struct NewComment {
  pub user_id: i32,
  pub blog_id: i32,
  pub paragraph_id: Option<i32>,
  pub text: String
}

impl NewComment {
  pub async fn insert(&self, db: &PgPool) -> Result<i32, sqlx::Error> {
    todo!()
  }
}
