import { Container, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";

function Home() {
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
          <span>Welcome to my home page!</span>
        </div>
      </Container>
    </div>
  );
}

export default Home;