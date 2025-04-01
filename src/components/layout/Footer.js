import React from "react";
import styled from "styled-components";
import { Container, Row, Col } from "react-bootstrap";

const FooterContainer = styled.footer`
  background-color: ${(props) => props.theme.colors.white};
  border-top: 1px solid ${(props) => props.theme.colors.border};
  padding: 1.5rem 0;
  color: ${(props) => props.theme.colors.textLight};
  font-size: 0.875rem;
  margin-left: ${(props) => props.theme.sizes.sidebarWidth};

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const FooterLink = styled.a`
  color: ${(props) => props.theme.colors.textLight};
  margin: 0 0.5rem;
  text-decoration: none;

  &:hover {
    color: ${(props) => props.theme.colors.primary};
    text-decoration: underline;
  }
`;

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <Container>
        <Row className="align-items-center">
          <Col md={6} className="text-center text-md-start">
            <p className="mb-0">
              &copy; {currentYear} Splitwise Clone. All rights reserved.
            </p>
          </Col>
          <Col md={6} className="text-center text-md-end mt-3 mt-md-0">
            <FooterLink href="#">Terms</FooterLink>
            <FooterLink href="#">Privacy</FooterLink>
            <FooterLink href="#">Support</FooterLink>
            <FooterLink href="#">Contact</FooterLink>
          </Col>
        </Row>
      </Container>
    </FooterContainer>
  );
};

export default Footer;
