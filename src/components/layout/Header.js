import React, { useContext, useState } from "react";
import Link from "next/link";
import {
  Navbar,
  Container,
  Nav,
  NavDropdown,
  Form,
  Button,
} from "react-bootstrap";
import styled from "styled-components";
import { BiSearch, BiBell, BiUser, BiLogOut, BiCog } from "react-icons/bi";
import { AuthContext } from "../../contexts/AuthContext";
import { ExpenseContext } from "../../contexts/ExpenseContext";

const StyledNavbar = styled(Navbar)`
  background-color: ${(props) => props.theme.colors.white};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  height: ${(props) => props.theme.sizes.headerHeight};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${(props) => props.theme.colors.primary};
  display: flex;
  align-items: center;

  img {
    height: 30px;
    margin-right: 8px;
  }
`;

const SearchForm = styled(Form)`
  position: relative;

  .form-control {
    padding-left: 2.5rem;
    background-color: ${(props) => props.theme.colors.inputBg};
    border: 1px solid ${(props) => props.theme.colors.border};
    border-radius: 20px;
    width: 300px;

    &:focus {
      box-shadow: none;
      border-color: ${(props) => props.theme.colors.primary};
    }

    @media (max-width: 992px) {
      width: 200px;
    }

    @media (max-width: 768px) {
      width: 100%;
    }
  }

  .search-icon {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: ${(props) => props.theme.colors.placeholder};
  }
`;

const AddExpenseButton = styled(Button)`
  margin-left: 1rem;
  border-radius: 20px;
  padding: 0.375rem 1.5rem;
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 0.5rem;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const NotificationBadge = styled.div`
  position: relative;

  .notification-count {
    position: absolute;
    top: -5px;
    right: -5px;
    background-color: ${(props) => props.theme.colors.danger};
    color: white;
    font-size: 0.75rem;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const Header = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
    console.log("Searching for:", searchTerm);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <StyledNavbar expand="lg">
      <Container fluid>
        <Link href="/dashboard" passHref>
          <Navbar.Brand as="div">
            <Logo>
              <img src="/images/logo.png" alt="Splitwise" />
              Splitwise
            </Logo>
          </Navbar.Brand>
        </Link>

        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <SearchForm className="d-flex mx-auto" onSubmit={handleSearch}>
            <BiSearch size={18} className="search-icon" />
            <Form.Control
              type="search"
              placeholder="Search expenses, groups, friends..."
              aria-label="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchForm>

          <Nav className="ms-auto">
            <Link href="/expenses/add" passHref>
              <AddExpenseButton as="a" variant="primary">
                Add Expense
              </AddExpenseButton>
            </Link>

            <Nav.Link href="#notifications" className="mx-2">
              <NotificationBadge>
                <BiBell size={22} />
                <span className="notification-count">3</span>
              </NotificationBadge>
            </Nav.Link>

            <NavDropdown
              title={
                <div className="d-flex align-items-center">
                  <UserAvatar>
                    {currentUser?.avatar ? (
                      <img src={currentUser.avatar} alt={currentUser.name} />
                    ) : (
                      currentUser?.name?.charAt(0)
                    )}
                  </UserAvatar>
                  <span className="d-none d-md-inline">
                    {currentUser?.name}
                  </span>
                </div>
              }
              id="navbarScrollingDropdown"
            >
              <NavDropdown.Item href="/profile">
                <BiUser className="me-2" size={18} />
                Your Profile
              </NavDropdown.Item>
              <NavDropdown.Item href="/settings">
                <BiCog className="me-2" size={18} />
                Settings
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>
                <BiLogOut className="me-2" size={18} />
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </StyledNavbar>
  );
};

export default Header;
