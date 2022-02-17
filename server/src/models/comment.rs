use chrono::{DateTime, Local};
use sqlx::{PgPool, Row};
use futures::TryStreamExt;
use serde::{Serialize, Deserialize};

use crate::models::user::{User};

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
pub struct PaginatedComments {
  pub results: Vec<Comment>,
  pub total: i64
}

impl Comment {
  async fn get_all_comments_for_blog(
    db:          &PgPool,
    blog_id:     &i32,
    page_number: &i32,
    page_size:   &i32
  ) -> Result<PaginatedComments, sqlx::Error> {
    let offset = page_number * page_size;

    let mut rows = sqlx::query_as::<_, Comment>(r#"
      SELECT * 
      FROM comments
      WHERE blog_id = $1 and paragraph_id is NULL
      ORDER BY created_at ASC
      OFFSET $2
      LIMIT $3
    "#).
      bind(blog_id).
      bind(offset).
      bind(page_size).
      fetch(db);

    let mut comments = Vec::new();
    while let Some(comment) = rows.try_next().await? {
      comments.push(comment);
    }

    let count = sqlx::query(r#"
      SELECT COUNT(*) as count
      FROM comments
      WHERE blog_id = $1 and paragraph_id is NULL
    "#).
      bind(blog_id).
      fetch_one(db);

    let total = count.await?.try_get("count")?;

    Ok(PaginatedComments{
      results: comments,
      total
    })
  }

  async fn get_all_comments_for_paragraph(
    db:           &PgPool,
    blog_id:      &i32, 
    paragraph_id: &i32,
    page_number:  &i32,
    page_size:    &i32
  ) -> Result<PaginatedComments, sqlx::Error> {
    let offset = page_number * page_size;

    let mut rows = sqlx::query_as::<_, Comment>(r#"
      SELECT * 
      FROM comments
      WHERE blog_id = $1 and paragraph_id = $2
      ORDER BY created_at ASC
      OFFSET $3
      LIMIT $4
    "#).
      bind(blog_id).
      bind(paragraph_id).
      bind(offset).
      bind(page_size).
      fetch(db);

    let mut comments = Vec::new();
    while let Some(comment) = rows.try_next().await? {
      comments.push(comment);
    }

    let count = sqlx::query(r#"
      SELECT COUNT(*) as count
      FROM comments
      WHERE blog_id = $1 and paragraph_id = $3
    "#).
      bind(blog_id).
      bind(paragraph_id).
      fetch_one(db);

    let total = count.await?.try_get("count")?;

    Ok(PaginatedComments{
      results: comments,
      total
    })
  }

  pub async fn get_all_comments(
    db:           &PgPool,
    blog_id:      &i32, 
    paragraph_id: &Option<i32>,
    page_number:  &i32,
    page_size:    &i32
  ) -> Result<PaginatedComments, sqlx::Error> {
    match paragraph_id {
      Some(p_id) => Comment::get_all_comments_for_paragraph(db, blog_id, p_id, page_number, page_size).await,
      None       => Comment::get_all_comments_for_blog(db, blog_id, page_number, page_size).await
    }
  }

  pub async fn find_by_id(db: &PgPool, id: &i32) -> Result<Comment, sqlx::Error> {
    sqlx::query_as::<_, Comment>("SELECT * FROM comments WHERE id = $1").
      bind(id).
      fetch_one(db).await
  }

  pub async fn delete(&self, db: &PgPool) -> Result<(), sqlx::Error> {
    sqlx::query(r#"
      DELETE
      FROM comments
      WHERE id = $1
    "#).
      bind(&self.id).
      execute(db).await?;

    Ok(())
  }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct NewComment {
  pub blog_id: i32,
  pub paragraph_id: Option<i32>,
  pub text: String
}

impl NewComment {
  async fn insert_blog_comment(&self, db: &PgPool, user: &User) -> Result<i32, sqlx::Error> {
    let result = sqlx::query(r#"
      INSERT INTO comments
      (user_id, blog_id, paragraph_id, text, created_at)
      VALUES
      ($1, $2, NULL, $3, NOW())
      RETURNING id;
    "#).
      bind(&user.id).
      bind(&self.blog_id).
      bind(&self.text).
      fetch_one(db);

    result.await?.try_get("id")
  }

  async fn insert_paragraph_comment(&self, db: &PgPool, user: &User) -> Result<i32, sqlx::Error> {
    let paragraph_id = &self.paragraph_id.clone().unwrap();

    let result = sqlx::query(r#"
      INSERT INTO comments
      (user_id, blog_id, paragraph_id, text, created_at)
      VALUES
      ($1, $2, $3, $4, NOW())
      RETURNING id;
    "#).
      bind(&user.id).
      bind(&self.blog_id).
      bind(paragraph_id).
      bind(&self.text).
      fetch_one(db);

    result.await?.try_get("id")
  }

  pub async fn insert(&self, db: &PgPool, user: &User) -> Result<i32, sqlx::Error> {
    match &self.paragraph_id {
      Some(_) => NewComment::insert_paragraph_comment(&self, db, user).await,
      None    => NewComment::insert_blog_comment(&self, db, user).await
    }
  }
}
