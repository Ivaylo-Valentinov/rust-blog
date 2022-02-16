ALTER TABLE likes
ADD CONSTRAINT UQ_UserId_BlogID UNIQUE (user_id, blog_id)