use chrono::{DateTime, Local};
use sqlx::{PgPool, Row};
use serde::{Serialize, Deserialize};
use futures::TryStreamExt;
use crate::models::user::User;

fn split_text_into_paragraphs(text: &str) -> Vec<&str> {
  text.split("\n").filter(|&x| !x.is_empty()).collect::<Vec<&str>>()
}

#[derive(Debug, sqlx::FromRow, Serialize, Deserialize)]
pub struct Blog {
  pub id: i32,
  pub title: String,
  pub is_draft: bool,
  pub text: Option<String>,
  pub added_by: i32,
  pub created_at: DateTime<Local>
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PaginatedBlogs {
  pub results: Vec<Blog>,
  pub total: i64
}

#[derive(Debug, sqlx::FromRow, Serialize, Deserialize)]
pub struct Paragraph {
  pub id: i32,
  pub blog_id: i32,
  pub text: String,
  pub created_at: DateTime<Local>
}

impl Blog {
  pub async fn find_by_id(db: &PgPool, id: &i32) -> Result<Self, sqlx::Error> {
    sqlx::query_as::<_, Blog>("SELECT * FROM blogs WHERE id = $1").
      bind(id).
      fetch_one(db).await
  }

  pub async fn update(&self, db: &PgPool, new_draft: &NewDraft) -> Result<(), sqlx::Error> {
    sqlx::query(r#"
      UPDATE blogs
      SET
        title = $1,
        text  = $2
      WHERE id = $3;
    "#).
      bind(&new_draft.title).
      bind(&new_draft.text).
      bind(&self.id).
      execute(db).await?;

    Ok(())
  }

  pub async fn find_all_drafts(db: &PgPool, user: &User, page_number: &i32, page_size: &i32) -> Result<PaginatedBlogs, sqlx::Error> {
    let offset = page_number * page_size;

    let mut rows = sqlx::query_as::<_, Blog>(r#"
      SELECT * 
      FROM blogs
      WHERE added_by = $1 and is_draft = TRUE
      ORDER BY created_at DESC
      OFFSET $2
      LIMIT $3
    "#).
      bind(user.id).
      bind(offset).
      bind(page_size).
      fetch(db);

    let mut drafts = Vec::new();
    while let Some(draft) = rows.try_next().await? {
      drafts.push(draft);
    }

    let count = sqlx::query(r#"
      SELECT COUNT(*) as count
      FROM blogs
      WHERE added_by = $1 and is_draft = TRUE
    "#).
      bind(user.id).
      fetch_one(db);

    let total = count.await?.try_get("count")?;

    Ok(PaginatedBlogs{
      results: drafts,
      total
    })
  }

  pub async fn find_all_published(db: &PgPool, search: &str, page_number: &i32, page_size: &i32) -> Result<PaginatedBlogs, sqlx::Error> {
    let offset = page_number * page_size;

    let mut rows = sqlx::query_as::<_, Blog>(r#"
      SELECT * 
      FROM blogs
      WHERE title LIKE $1 and is_draft = FALSE
      ORDER BY created_at DESC
      OFFSET $2
      LIMIT $3
    "#).
      bind(search).
      bind(offset).
      bind(page_size).
      fetch(db);

    let mut blogs = Vec::new();
    while let Some(blog) = rows.try_next().await? {
      blogs.push(blog);
    }

    let count = sqlx::query(r#"
      SELECT COUNT(*) as count
      FROM blogs
      WHERE title LIKE $1 and is_draft = FALSE
    "#).
      bind(search).
      fetch_one(db);

    let total = count.await?.try_get("count")?;

    Ok(PaginatedBlogs{
      results: blogs,
      total
    })
  }

  pub async fn publish(&self, db: &PgPool)-> Result<(), sqlx::Error> {
    let text = &self.text.clone().unwrap();
    let paragraphs = split_text_into_paragraphs(&text);

    for paragraph_text in paragraphs.iter() {
      let new_paragraph = NewParagraph {
        blog_id: self.id.clone(),
        text: String::from(*paragraph_text)
      };

      new_paragraph.insert(&db).await?;
    }

    sqlx::query(r#"
      UPDATE blogs 
      SET
        is_draft = FALSE,
        text = NULL 
      WHERE id = $1
    "#).
      bind(&self.id).
      execute(db).await?;

    Ok(())
  }
}

#[derive(Debug, Deserialize, Serialize)]
pub struct NewDraft {
  pub title: String,
  pub text: String
}

impl NewDraft {
  pub async fn insert(&self, db: &PgPool, user: &User) -> Result<i32, sqlx::Error> {
    let result = sqlx::query(r#"
      INSERT INTO blogs
      (title, is_draft, text, added_by, created_at)
      VALUES
      ($1, TRUE, $2, $3, NOW())
      RETURNING id;
    "#).
      bind(&self.title).
      bind(&self.text).
      bind(&user.id).
      fetch_one(db);

    result.await?.try_get("id")
  }
}

pub struct NewParagraph {
  pub blog_id: i32,
  pub text: String
}

impl NewParagraph {
  pub async fn insert(&self, db: &PgPool) -> Result<i32, sqlx::Error> {
    let result = sqlx::query(r#"
      INSERT INTO paragraphs
      (blog_id, text, created_at)
      VALUES
      ($1, $2, NOW())
      RETURNING id;
    "#).
      bind(&self.blog_id).
      bind(&self.text).
      fetch_one(db);

    result.await?.try_get("id")
  }
}
