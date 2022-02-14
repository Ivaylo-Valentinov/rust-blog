use chrono::{DateTime, Local};
// use sqlx::{PgPool, Row};
use serde::Deserialize;

#[derive(Debug, sqlx::FromRow, Deserialize)]
pub struct Blog {
    pub id: i32,
    pub title: String,
    pub is_draft: bool,
    pub text: Option<String>,
    pub added_by: i32,
    pub created_at: DateTime<Local>
}

#[derive(Debug, sqlx::FromRow, Deserialize)]
pub struct Paragraph {
    pub id: i32,
    pub blog_id: i32,
    pub text: String,
    pub created_at: DateTime<Local>
}
