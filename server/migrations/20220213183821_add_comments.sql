CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  blog_id INTEGER NOT NULL,
  paragraph_id INTEGER,
  text VARCHAR NOT NULL,

  created_at TIMESTAMPTZ NOT NULL,

  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (blog_id) REFERENCES blogs(id)
)