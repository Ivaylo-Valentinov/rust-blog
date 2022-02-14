// use futures::TryStreamExt;
use chrono::{DateTime, Local};
// use sqlx::{PgPool, Row};
use serde::Deserialize;

#[derive(Debug, sqlx::FromRow, Deserialize)]
pub struct Comment {
    pub id: i32,
    pub user_id: i32,
    pub blog_id: i32,
    pub paragraph_id: Option<i32>,
    pub text: String,
    pub created_at: DateTime<Local>
}