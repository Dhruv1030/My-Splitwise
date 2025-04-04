import React, { useContext } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import {
  BiHome,
  BiReceipt,
  BiGroup,
  BiUser,
  BiCog,
  BiLogOut,
  BiDollarSign,
  BiChart,
} from "react-icons/bi";
import { AuthContext } from "../../contexts/AuthContext";

const Navigation = () => {
  const router = useRouter();
  const { currentUser, logout } = useContext(AuthContext);

  const isActive = (path) => router.pathname === path;

  const handleLogout = () => {
    if (logout) {
      logout();
    }
    router.push("/login");
  };

  if (!currentUser) return null;

  return (
    <Navbar bg="white" expand="lg" className="fixed-top shadow-sm">
      <Container>
        <Link href="/dashboard" passHref legacyBehavior>
          <Navbar.Brand>
            <div
              className="d-flex align-items-center fw-bold"
              style={{ color: "#5bc5a7" }}
            >
              {/* <BiDollarSign size={24} className="me-2" /> */}
              Splitwise
            </div>
          </Navbar.Brand>
        </Link>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link href="/dashboard" passHref legacyBehavior>
              <Nav.Link active={isActive("/dashboard")}>
                <BiHome size={18} className="me-1" /> Dashboard
              </Nav.Link>
            </Link>
            <Link href="/expenses" passHref legacyBehavior>
              <Nav.Link active={isActive("/expenses")}>
                <BiReceipt size={18} className="me-1" /> Expenses
              </Nav.Link>
            </Link>
            <Link href="/groups" passHref legacyBehavior>
              <Nav.Link active={isActive("/groups")}>
                <BiGroup size={18} className="me-1" /> Groups
              </Nav.Link>
            </Link>
            <Link href="/friends" passHref legacyBehavior>
              <Nav.Link active={isActive("/friends")}>
                <BiUser size={18} className="me-1" /> Friends
              </Nav.Link>
            </Link>
            <Link href="/analytics" passHref legacyBehavior>
              <Nav.Link active={isActive("/analytics")}>
                <BiChart size={18} className="me-1" /> Analytics
              </Nav.Link>
            </Link>
          </Nav>

          <Nav>
            <NavDropdown
              title={
                <div className="d-flex align-items-center">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center me-2"
                    style={{
                      width: "32px",
                      height: "32px",
                      backgroundColor: "#5bc5a7",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    {currentUser.name
                      ? currentUser.name.charAt(0).toUpperCase()
                      : "U"}
                  </div>
                  <span>{currentUser.name || "User"}</span>
                </div>
              }
              id="user-dropdown"
              align="end"
            >
              <Link href="/profile" passHref legacyBehavior>
                <NavDropdown.Item active={isActive("/profile")}>
                  <BiUser size={18} className="me-2" /> Profile
                </NavDropdown.Item>
              </Link>
              <Link href="/settings" passHref legacyBehavior>
                <NavDropdown.Item active={isActive("/settings")}>
                  <BiCog size={18} className="me-2" /> Settings
                </NavDropdown.Item>
              </Link>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>
                <BiLogOut size={18} className="me-2" /> Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
