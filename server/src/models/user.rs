use futures::TryStreamExt;
use chrono::{DateTime, Local};
use sqlx::{PgPool, Row};
use serde::Deserialize;

#[derive(Debug, sqlx::FromRow, Deserialize)]
pub struct User {
    pub id: i32,
    pub name: String,
    pub email: String,
    pub password: String,
    pub auth_token: Option<String>,
    pub created_at: DateTime<Local>
}
