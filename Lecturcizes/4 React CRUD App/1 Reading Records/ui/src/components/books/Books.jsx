import { useState, useEffect } from "react";
import { Alert, Container, Spinner, Table } from "react-bootstrap";
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import axios from "axios";

import Book from "./Book";

function Books() {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/books")
      .then(response => {
        setBooks(response.data);
        setError(null);
      })
      .catch(error => {
        setError(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
        <div id="background" className="min-vh-100">
      <Container id="container" className="min-vh-100 d-flex flex-column">
        <div id="header">
          <div className="py-5 px-3 bg-light">
            <h1>Mike's Library App</h1>
            <p>Sort of...</p>
          </div>
          <Nav className="bg-secondary">
            <Nav.Link as={NavLink} to="/">Home</Nav.Link>
            <Nav.Link as={NavLink} to="/books">Books</Nav.Link>
          </Nav>
        </div>

        <div id="body" className="px-2 py-3 mt-0 bg-light flex-grow-1">
          <Container className="pt-3">
            {error && <Alert variant="danger" dismissible>Failed to load books.</Alert>}
            <h3>Books</h3>
            {isLoading
              ?
              <Spinner />
              :
              books.length > 0
                ?
                <Table bordered striped hover>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Author</th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.map(book => <Book key={book.id} book={book} />)}
                  </tbody>
                </Table>
                :
                <>No books available</>
            }
          </Container>
        </div>
      </Container>
    </div>
  );
}

export default Books;