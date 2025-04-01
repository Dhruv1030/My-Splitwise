import React, { useContext } from "react";
import Link from "next/link";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { AuthContext } from "../../contexts/AuthContext";

// Create the simplest possible navigation component with minimal dependencies
const Navigation = () => {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) return null;

  return (
    <Navbar bg="white" expand="lg" className="fixed-top shadow-sm">
      <Container>
        <Navbar.Brand href="/dashboard">Splitwise</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/dashboard">Dashboard</Nav.Link>
            <Nav.Link href="/expenses">Expenses</Nav.Link>
            <Nav.Link href="/groups">Groups</Nav.Link>
            <Nav.Link href="/friends">Friends</Nav.Link>
          </Nav>

          <Nav>
            <NavDropdown
              title={currentUser.name || "User"}
              id="user-dropdown"
              align="end"
            >
              <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
              <NavDropdown.Item href="/settings">Settings</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/login">Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
