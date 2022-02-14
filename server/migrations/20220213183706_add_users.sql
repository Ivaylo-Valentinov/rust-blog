CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  password VARCHAR NOT NULL,
  auth_token VARCHAR,

  created_at TIMESTAMPTZ NOT NULL,
  UNIQUE (email)
)