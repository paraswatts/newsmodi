DROP DATABASE IF EXISTS news;
CREATE DATABASE news;

\c news;

CREATE TABLE news_articles (
  ID SERIAL PRIMARY KEY,
  source jsonb,
  author VARCHAR,
  description VARCHAR,
  url VARCHAR,
  urlToImage VARCHAR,
  publishedAt VARCHAR 
);


-- INSERT INTO news_articles (name, breed, age, sex)
--   VALUES ('Tyler', 'Retrieved', 3, 'M');