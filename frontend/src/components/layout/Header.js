import React from "react";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import { useAuthState } from "../../contexts/AuthContext";

function Header() {
  const { isAuthenticated, authRole, authUser } = useAuthState();

  return (
    <Navbar collapseOnSelect expand="md" bg="dark" variant="dark">
      <Navbar.Brand as={Link} to="/">
        Restaurants Reviews
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        {isAuthenticated && (
          <Nav className="mr-auto">
            {authRole === "regular" && (
              <Nav.Link as={Link} to="/restaurants">
                Restaurants
              </Nav.Link>
            )}
            {authRole === "owner" && (
              <Nav.Link as={Link} to="/reviews">
                Pending Reviews
              </Nav.Link>
            )}

            {(authRole === "owner" || authRole === "admin") && (
              <Nav.Link as={Link} to="/restaurants">
                Manage Restaurants
              </Nav.Link>
            )}

            {authRole === "admin" && (
              <Nav.Link as={Link} to="/users">
                Manage Users
              </Nav.Link>
            )}

          </Nav>
        )}

        <Nav className="ml-auto">
          {!isAuthenticated && (
            <>
              <Nav.Link as={Link} to="/login">
                Login
              </Nav.Link>
              <Nav.Link as={Link} to="/register">
                Register
              </Nav.Link>
            </>
          )}
          {isAuthenticated && (
            <NavDropdown title={authUser.name} id="collasible-nav-dropdown">
              <NavDropdown.Item as={Link} to="/profile">
                Profile
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/logout">
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;
