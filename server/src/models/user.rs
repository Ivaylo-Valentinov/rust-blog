use chrono::{DateTime, Local};
use sqlx::{PgPool, Row};
use serde::{Serialize, Deserialize};
use bcrypt::{DEFAULT_COST, hash};
use rand::random;

fn rand_string() -> String {
    (0..64).map(|_| random::<char>()).collect()
}

#[derive(Debug, sqlx::FromRow, Deserialize, Serialize)]
pub struct User {
    pub id: i32,
    pub name: String,
    pub email: String,
    pub password: String,
    pub auth_token: Option<String>,
    pub created_at: DateTime<Local>
}

impl User {
    pub async fn find_by_email(db: &PgPool, email: &String) -> Result<Self, sqlx::Error> {
        sqlx::query_as::<_, User>("SELECT * FROM users WHERE email = $1").
            bind(email).
            fetch_one(db).await
    }

    pub async fn set_auth_token(&self, db: &PgPool) -> Result<(), sqlx::Error> {
        let auth_token = rand_string();

        sqlx::query("UPDATE users SET auth_token = $1 WHERE id = $2").
            bind(&auth_token).
            bind(&self.id).
            execute(db).await?;

        Ok(())
    }

    pub async fn get_user_by_auth_token(db: &PgPool, auth_token: &String) -> Result<Self, sqlx::Error> {
        sqlx::query_as::<_, User>("SELECT * FROM users WHERE auth_token = $1").
            bind(auth_token).
            fetch_one(db).await
    }
}

#[derive(Debug, Deserialize, Serialize)]
pub struct NewUser {
    pub name: String,
    pub email: String,
    pub password: String,
}

impl NewUser {
    pub async fn insert(&self, db: &PgPool) -> Result<i32, sqlx::Error> {
        let hashed_password = hash(&self.password, DEFAULT_COST).unwrap();

        let result = sqlx::query(r#"
            INSERT INTO users
            (name, email, password, created_at)
            VALUES
            ($1, $2, $3, NOW())
            RETURNING id;
        "#).
            bind(&self.name).
            bind(&self.email).
            bind(&hashed_password).
            fetch_one(db);

        result.await?.try_get("id")
    }
}
