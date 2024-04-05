import { useEffect, useState } from "react";
import { Container, Navbar, Nav } from "react-bootstrap";
import { NavLink, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { unauthenticated } from "../slices/authSlice";
import axios from "axios";

import LogInModal from "../components/modals/LogInModal";

function ApplicationLayout() {
  const dispatch = useDispatch();

  const auth = useSelector(state => state.auth);
  const [showLogInModal, setShowLogInModal] = useState(false);

  useEffect(() => {
    console.log(auth);
  }, [auth]);

  function handleRegisterClick() {
    console.log("Registering...");
  }

  function handleLoginClick() {
    setShowLogInModal(true);
    console.log("Logging in...");
  }

  function handleLogoutClick() {
    axios.post("/api/auth/logout")
      .then(response => {
        console.log(response.data);
        dispatch(unauthenticated());
      })
      .catch(error => {
        console.error(error);
      });
    console.log("Logging out...");
  }

  return (
    <div id="background" className="min-vh-100">
      <Container id="container" className="min-vh-100 d-flex flex-column">
        <div id="header">
          <div className="py-5 px-3 bg-light">
            <h1>Mike's Library App</h1>
            <p>Sort of...</p>
          </div>
          <Navbar className="justify-content-between bg-secondary">
            <Nav className="bg-secondary">
              <Nav.Link as={NavLink} to="/">Home</Nav.Link>
              <Nav.Link as={NavLink} to="/books">Books</Nav.Link>
              <Nav.Link as={NavLink} to="/authors">Authors</Nav.Link>
            </Nav>
            <Nav className="bg-secondary justify-content-end">
              {auth?.isAuthenticated ?
                <Nav.Link onClick={handleLogoutClick}>Log out</Nav.Link>
                :
                <>
                  <Nav.Link onClick={handleLoginClick}>Log in</Nav.Link>
                  <Nav.Link onClick={handleRegisterClick}>Register</Nav.Link>
                </>
              }
            </Nav>
          </Navbar>
        </div>

        <div id="body" className="px-2 py-3 mt-0 bg-light flex-grow-1">
          <Outlet />
        </div>

        <LogInModal show={showLogInModal} setShow={setShowLogInModal} />
      </Container>
    </div>
  );
}

export default ApplicationLayout;