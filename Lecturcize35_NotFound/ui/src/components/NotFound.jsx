import { Container } from "react-bootstrap";

function NotFound() {
  return (
    <Container className="pt-3">
      <h1>Oops!</h1>
      <p>The page you are looking for doesn't seem to exist.</p>
    </Container>
  );
}

export default NotFound;