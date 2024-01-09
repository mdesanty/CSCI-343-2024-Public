-- To run this: psql -U fullstack -d postgres -f CreateDB.sql

DROP DATABASE IF EXISTS books_db;
CREATE DATABASE books_db;

\c books_db

DROP TABLE IF EXISTS books CASCADE;
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  author VARCHAR(255) NOT NULL
);

INSERT INTO books(name, author) VALUES('The Cat in the Hat', 'Dr. Seuss');
INSERT INTO books(name, author) VALUES('Goodnight Moon', 'Margaret Wise Brown');
INSERT INTO books(name, author) VALUES('The Princess Bride', 'William Goldman');
INSERT INTO books(name, author) VALUES('The Silence of the Lambs', 'Thomas Harris');
INSERT INTO books(name, author) VALUES('Somehow I Manage', 'Michael G. Scott');