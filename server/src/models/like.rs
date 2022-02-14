// use futures::TryStreamExt;
use chrono::{DateTime, Local};
// use sqlx::{PgPool, Row};
use serde::Deserialize;

#[derive(Debug, sqlx::FromRow, Deserialize)]
pub struct Like {
    pub id: i32,
    pub user_id: i32,
    pub blog_id: i32,
    pub created_at: DateTime<Local>
}