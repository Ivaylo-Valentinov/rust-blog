use chrono::{DateTime, Local};
use sqlx::{PgPool, Row};
use serde::{Serialize, Deserialize};

#[derive(Debug, sqlx::FromRow, Serialize, Deserialize)]
pub struct Like {
  pub id: i32,
  pub user_id: i32,
  pub blog_id: i32,
  pub created_at: DateTime<Local>
}

#[derive(Debug, Serialize, Deserialize)]
pub struct LikeInfo {
  pub user_liked: bool,
  pub like_count: i64
}

impl Like {
  pub async fn get_likes_info(db: &PgPool, user_id: &i32, blog_id: &i32) -> Result<LikeInfo, sqlx::Error> {
    let user_like = sqlx::query_as::<_, Like>(r#"
      SELECT *
      FROM likes
      WHERE user_id = $1 and blog_id = $2
    "#).
      bind(user_id).
      bind(blog_id).
      fetch_optional(db).await?;

    let user_liked = match user_like {
      Some(_) => true,
      None    => false
    };

    let count = sqlx::query(r#"
      SELECT COUNT(*) as count
      FROM likes
      WHERE blog_id = $1
    "#).
      bind(blog_id).
      fetch_one(db);

    let like_count = count.await?.try_get("count")?;

    Ok(LikeInfo{
      user_liked,
      like_count
    })
  }

  pub async fn insert(db: &PgPool, user_id: &i32, blog_id: &i32) -> Result<i32, sqlx::Error> {
    let result = sqlx::query(r#"
      INSERT INTO likes
      (user_id, blog_id, created_at)
      VALUES
      ($1, $2, NOW())
      RETURNING id;
    "#).
      bind(user_id).
      bind(blog_id).
      fetch_one(db);

    result.await?.try_get("id")
  }

  pub async fn delete(db: &PgPool, user_id: &i32, blog_id: &i32) -> Result<(), sqlx::Error> {
    sqlx::query(r#"
      DELETE
      FROM likes
      WHERE user_id = $1 and blog_id = $2
    "#).
      bind(user_id).
      bind(blog_id).
      execute(db).await?;

    Ok(())
  }
}
