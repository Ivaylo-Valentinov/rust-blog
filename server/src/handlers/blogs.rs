use actix_web::{web, HttpResponse};
use sqlx::PgPool;
use serde::{Serialize, Deserialize};

use crate::models::user::{User};
use crate::models::blog::{NewDraft, Blog, Paragraph};
use super::*;

#[derive(Debug, Deserialize)]
pub struct Pagination {
  pub title: Option<String>,
  pub page_number: i32,
  pub page_size: i32
}

#[derive(Debug, Serialize)]
pub struct BlogDetails {
  pub blog: Blog,
  pub paragraphs: Vec<Paragraph>
}

pub async fn create_new_draft(
  db:   web::Data<PgPool>,
  user: User,
  form: web::Json<NewDraft>
) -> HttpResponse {
  let new_draft = form.into_inner();

  send_json(new_draft.insert(&db, &user).await)
}

pub async fn update_new_draft(
  db:   web::Data<PgPool>,
  user: User,
  path: web::Path<i32>,
  form: web::Json<NewDraft>
) -> HttpResponse {
  let new_draft = form.into_inner();
  let web::Path(id) = path;

  let blog = Blog::find_by_id(&db, &id).await;

  if let Err(_) = blog {
    return send_error("Not valid id!")
  }

  let blog = blog.unwrap();

  if !blog.is_draft {
    return send_error("Cannot edit published blog posts!")
  }

  if blog.added_by != user.id {
    return send_error("Cannot edit drafts you don't own!")
  }

  send_json(blog.update(&db, &new_draft).await)
}

pub async fn get_published_blog(
  db:   web::Data<PgPool>,
  _:    User,
  path: web::Path<i32>
) -> HttpResponse {
  let web::Path(id) = path;

  let blog = Blog::find_by_id(&db, &id).await;

  if let Err(_) = blog {
    return send_error("Not valid id!")
  }

  let blog = blog.unwrap();

  if blog.is_draft {
    return send_error("This is not a published post!")
  }

  let paragraphs = Paragraph::get_all_paragraphs_by_blog_id(&db, &blog.id).await;

  if let Err(_) = paragraphs {
    return send_error("Paragraph error!")
  }

  let paragraphs = paragraphs.unwrap();

  send_json(Ok(BlogDetails {
    blog,
    paragraphs
  }))
}

pub async fn get_draft_blog(
  db:   web::Data<PgPool>,
  user: User,
  path: web::Path<i32>
) -> HttpResponse {
  let web::Path(id) = path;

  let blog = Blog::find_by_id(&db, &id).await;

  if let Err(_) = blog {
    return send_error("Not valid id!")
  }

  let blog = blog.unwrap();

  if !blog.is_draft {
    return send_error("This is a published post!")
  }

  if blog.added_by != user.id {
    return send_error("Cannot see drafts you don't own!")
  }

  send_json(Ok(blog))
}

pub async fn get_drafts_paginated(
  db:     web::Data<PgPool>,
  user:   User,
  params: web::Query<Pagination>
) -> HttpResponse {
  let pagination = params.into_inner();

  send_json(Blog::find_all_drafts(&db, &user, &pagination.page_number, &pagination.page_size).await)
}

pub async fn get_published_paginated(
  db:     web::Data<PgPool>,
  _:      User,
  params: web::Query<Pagination>
) -> HttpResponse {
  let pagination = params.into_inner();

  let mut search = pagination.title.unwrap_or(String::from(""));
  search.push_str("%");

  send_json(Blog::find_all_published(&db, &search, &pagination.page_number, &pagination.page_size).await)
}

pub async fn publish(
  db:   web::Data<PgPool>,
  user: User,
  path: web::Path<i32>
) -> HttpResponse {
  let web::Path(id) = path;

  let blog = Blog::find_by_id(&db, &id).await;

  if let Err(_) = blog {
    return send_error("Not valid id!")
  }

  let blog = blog.unwrap();

  if !blog.is_draft {
    return send_error("This is a published post!")
  }

  if blog.added_by != user.id {
    return send_error("Cannot publish drafts you don't own!")
  }

  send_json(blog.publish(&db).await)
}

pub async fn something(
  _db:   web::Data<PgPool>,
  user: User
) -> HttpResponse {
  send_json(Ok(&user))
}
