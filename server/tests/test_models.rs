use dotenv::dotenv;
use sqlx::PgPool;
use bcrypt::{verify};

use server::models::user::{NewUser, User};

fn is_error<T, E>(result: Result<T, E>) -> bool {
  match result {
    Ok(_)  => false,
    Err(_) => true
  }
}

async fn get_db() -> PgPool {
  dotenv().ok();

  let database_url = std::env::var("TEST_DATABASE_URL").
      expect("TEST_DATABASE_URL must be set");

  let db = PgPool::connect(&database_url).
      await.
      unwrap_or_else(|_| panic!("Error connecting to {}", database_url));

  sqlx::migrate!("./migrations").
      run(&db).
      await.
      unwrap();

  db
}

async fn clean_db(db: &PgPool) {
  sqlx::query("DELETE FROM likes").execute(db).await.unwrap();
  sqlx::query("DELETE FROM comments").execute(db).await.unwrap();
  sqlx::query("DELETE FROM paragraphs").execute(db).await.unwrap();
  sqlx::query("DELETE FROM blogs").execute(db).await.unwrap();
  sqlx::query("DELETE FROM users").execute(db).await.unwrap();
}

async fn create_a_user(db: &PgPool) -> User {
  let new_user = NewUser {
    name: String::from("Test"),
    email: String::from("test1@test.com"),
    password: String::from("123")
  };

  new_user.insert(db).await.unwrap();
  let email = String::from("test1@test.com");

  User::find_by_email(db, &email).await.unwrap()
}


async fn create_a_logged_user(db: &PgPool) -> User {
  let new_user = NewUser {
    name: String::from("Test"),
    email: String::from("test2@test.com"),
    password: String::from("123")
  };

  let id = new_user.insert(db).await.unwrap();
  let email = String::from("test2@test.com");
  let auth_token = String::from("123");

  sqlx::query("UPDATE users SET auth_token = $1 WHERE id = $2").
    bind(&auth_token).
    bind(&id).
    execute(db).await.unwrap();

  User::find_by_email(db, &email).await.unwrap()
}

#[actix_rt::test]
async fn test_user_insertion() {
  let db = get_db().await;
  clean_db(&db).await;

  let email = String::from("test@test.com");

  let new_user = NewUser {
    name: String::from("Test"),
    email: email.clone(),
    password: String::from("123")
  };

  let id = new_user.insert(&db).await.unwrap();
  let user = User::find_by_email(&db, &email).await.unwrap();

  assert_eq!(user.id, id);
  assert_eq!(user.email, new_user.email);
  assert_eq!(user.name, new_user.name);

  let valid = verify(&new_user.password, &user.password).unwrap();
  assert!(valid);
}

#[actix_rt::test]
async fn test_user_set_auth_token() {
  let db = get_db().await;
  clean_db(&db).await;

  let user = create_a_user(&db).await;
  assert!(user.auth_token.is_none());

  user.set_auth_token(&db).await.unwrap();
  
  let user = User::find_by_email(&db, &user.email).await.unwrap();
  assert!(!user.auth_token.is_none());
}

#[actix_rt::test]
async fn test_user_get_user_by_auth_token() {
  let db = get_db().await;
  clean_db(&db).await;

  let user = create_a_user(&db).await;
  let logged_user = create_a_logged_user(&db).await;
  assert_ne!(user.id, logged_user.id);

  let new_user = User::get_user_by_auth_token(&db, &logged_user.auth_token.unwrap()).await.unwrap();
  assert_eq!(logged_user.id, new_user.id);

  user.set_auth_token(&db).await.unwrap();
  
  let user = User::find_by_email(&db, &user.email).await.unwrap();
  let new_user = User::get_user_by_auth_token(&db, &user.auth_token.unwrap()).await.unwrap();
  assert_eq!(user.id, new_user.id);


  let some_non_existing_auth_token = String::from("some_non_existing_auth_token");
  assert!(is_error(User::get_user_by_auth_token(&db, &some_non_existing_auth_token).await))
}
