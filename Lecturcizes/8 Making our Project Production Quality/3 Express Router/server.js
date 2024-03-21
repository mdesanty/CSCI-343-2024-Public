require("dotenv").config();

const express = require("express");
const pgClient = require("./pgClient");

const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * we can use an Express Router object to define specific sets of routes,
 * like our author and book routes.
 *
 * Once we've defined the routes in our router object, we add the routes
 * to the app with the .use method.
 */
const authorRoutes = express.Router();
authorRoutes.get("/", getAuthors);
authorRoutes.get("/:id", getAuthor);
authorRoutes.post("/", createAuthor);
authorRoutes.put("/:id", updateAuthor);
authorRoutes.delete("/:id", deleteAuthor);

app.use("/authors", authorRoutes);

const bookRoutes = express.Router();
bookRoutes.get("/", getBooks);
bookRoutes.get("/:id", getBook);
bookRoutes.post("/", createBook);
bookRoutes.put("/:id", updateBook);
bookRoutes.delete("/:id", deleteBook);

app.use("/books", bookRoutes);

const listener = app.listen(process.env.PORT, process.env.HOST, () => {
  console.log(`Server listening at ${listener.address().address}:${listener.address().port}`);
});

function getAuthors(req, res) {
  pgClient.query("SELECT id, title, first_name, middle_name, last_name FROM authors ORDER BY id")
  .then((results) => {
    res.status(200).json(results.rows);
  })
  .catch((error) => {
    res.status(500).json({ error: `We encountered an error with your request: ${error}.` });
  });
}

function getAuthor(req, res) {
  pgClient.query("SELECT id, title, first_name, middle_name, last_name FROM authors WHERE id = $1", [req.params.id])
    .then((results) => {
      if(results.rowCount > 0) {
        res.status(200).json(results.rows[0]);
      }
      else {
        res.status(404).json({ error: `Author not found for id ${req.params.id}` });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: `We encountered an error with your request: ${error}.` });
    });
}

function createAuthor(req, res) {
  const author = req.body;
  const sql = "INSERT INTO authors (title, first_name, middle_name, last_name) VALUES ($1, $2, $3, $4) RETURNING id";

  pgClient.query(sql, [author.title, author.first_name, author.middle_name, author.last_name])
    .then((results) => {
      res.location(`/authors/${results.rows[0].id}`);
      res.status(201).json({ message: 'Author created successfully.' });
    })
    .catch((error) => {
      res.status(500).json({ error: `We encountered an error with your request: ${ error }.` });
    });
}

function updateAuthor(req, res) {
  const author = req.body;
  const sql = "UPDATE authors SET title = $1, first_name = $2, middle_name = $3, last_name = $4 WHERE id = $5";

  pgClient.query(sql, [author.title, author.first_name, author.middle_name, author.last_name, req.params.id])
    .then((results) => {
      if (results.rowCount > 0) {
        res.status(200).json({ message: "Author successfully updated." });
      }
      else {
        res.status(404).json({ error: `Author not found for id ${req.params.id}` });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: `Error updating author: ${ error }` });
    });
}

function deleteAuthor(req, res) {
  pgClient.query("DELETE FROM authors WHERE id = $1", [req.params.id])
    .then((results) => {
      if (results.rowCount > 0) {
        res.status(200).json({ message: "Author successfully deleted." });
      }
      else {
        res.status(404).json({ error: `Author not found for id ${req.params.id}` });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: `Error deleting author: ${ error }` });
    });
}

function getBooks(req, res) {
  const sql = `
    SELECT
      b.id,
      b.title,
      json_build_object(
        'id', a.id,
        'title', a.title,
        'first_name', a.first_name,
        'middle_name', a.middle_name,
        'last_name', a.last_name
      ) AS author
    FROM
      books b
      INNER JOIN authors a ON a.id = b.author_id
    ORDER BY
      b.id
  `;

  pgClient.query(sql)
    .then((results) => {
      res.status(200).json(results.rows);
    })
    .catch((error) => {
      res.status(500).json({ error: `We encountered an error with your request: ${error}.` });
    });
}

function getBook(req, res) {
  const sql = `
    SELECT
      b.id,
      b.title,
      json_build_object(
        'id', a.id,
        'title', a.title,
        'first_name', a.first_name,
        'middle_name', a.middle_name,
        'last_name', a.last_name
      ) AS author
    FROM
      books b
      INNER JOIN authors a ON a.id = b.author_id
    WHERE
      b.id = $1
  `;

  pgClient.query(sql, [req.params.id])
    .then((results) => {
      if(results.rowCount > 0) {
        res.status(200).json(results.rows[0]);
      }
      else {
        res.status(404).json({ error: `Book not found for id ${req.params.id}` });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: `We encountered an error with your request: ${error}.` });
    });
}

function createBook(req, res) {
  const book = req.body;

  pgClient.query("INSERT INTO books (title, author_id) VALUES ($1, $2) RETURNING id", [book.title, book.author_id])
    .then((results) => {
      res.location(`/books/${results.rows[0].id}`);
      res.status(201).json({ message: 'Book created successfully.' });
    })
    .catch((error) => {
      res.status(500).json({ error: `We encountered an error with your request: ${ error }.` });
    });
}

function updateBook(req, res) {
  const book = req.body;

  pgClient.query("UPDATE books SET title = $1, author_id = $2 WHERE id = $3", [book.title, book.author_id, req.params.id])
    .then((results) => {
      if (results.rowCount > 0) {
        res.status(200).json({ message: "Book successfully updated." });
      }
      else {
        res.status(404).json({ error: `Book not found for id ${req.params.id}` });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: `Error updating book: ${ error }` });
    });
}

function deleteBook(req, res) {
  pgClient.query("DELETE FROM books WHERE id = $1", [req.params.id])
    .then((results) => {
      if (results.rowCount > 0) {
        res.status(200).json({ message: "Book successfully deleted." });
      }
      else {
        res.status(404).json({ error: `Book not found for id ${req.params.id}` });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: `Error deleting book: ${ error }` });
    });
}