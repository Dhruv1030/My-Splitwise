import Head from "next/head";
import Link from "next/link";
import styled from "styled-components";
import { Container, Row, Col, Button, Navbar, Nav } from "react-bootstrap";
import {
  FiDollarSign,
  FiUsers,
  FiCreditCard,
  FiCheckCircle,
  FiArrowRight,
} from "react-icons/fi";

const Header = styled(Navbar)`
  padding: 1rem 0;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #16b174;
  display: flex;
  align-items: center;

  svg {
    margin-right: 0.5rem;
  }
`;

const NavLink = styled(Nav.Link)`
  margin: 0 0.5rem;
  font-weight: 500;

  &:hover {
    color: #16b174 !important;
  }
`;

const HeaderButton = styled(Button)`
  margin-left: 0.5rem;
  font-weight: 500;
  padding: 0.375rem 1rem;
`;

const HeroSection = styled.section`
  padding: 80px 0;
  background-color: #f6f8fa;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #464646;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  color: #6e7a88;
  line-height: 1.6;
`;

const ActionButton = styled(Button)`
  padding: 0.75rem 1.5rem;
  margin-right: 1rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const FeatureSection = styled.section`
  padding: 80px 0;
  background-color: white;
`;

const SectionTitle = styled.h2`
  font-size: 2.25rem;
  font-weight: 700;
  margin-bottom: 3rem;
  text-align: center;
`;

const FeatureCard = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  border-radius: 8px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const FeatureIcon = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: ${({ color }) => color || "#16B174"};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  font-size: 1.75rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #464646;
`;

const FeatureDescription = styled.p`
  color: #6e7a88;
  margin-bottom: 0;
`;

const TestimonialSection = styled.section`
  padding: 80px 0;
  background-color: #f6f8fa;
`;

const TestimonialCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const TestimonialText = styled.p`
  font-style: italic;
  margin-bottom: 1.5rem;
  color: #464646;
`;

const TestimonialAuthor = styled.div`
  display: flex;
  align-items: center;
`;

const Avatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #e9ebed;
  margin-right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6e7a88;
  font-weight: 600;
`;

const AuthorInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const AuthorName = styled.span`
  font-weight: 600;
  color: #464646;
`;

const AuthorTitle = styled.span`
  font-size: 0.875rem;
  color: #6e7a88;
`;

const CTASection = styled.section`
  padding: 80px 0;
  background-color: #16b174;
  color: white;
  text-align: center;
`;

const CTATitle = styled.h2`
  font-size: 2.25rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
`;

const CTASubtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
`;

const CTAButton = styled(Button)`
  padding: 0.75rem 2rem;
  font-weight: 500;
  background-color: white;
  color: #16b174;
  border: none;

  &:hover {
    background-color: #f6f8fa;
    color: #16b174;
  }

  svg {
    margin-left: 0.5rem;
  }
`;

const Footer = styled.footer`
  padding: 3rem 0;
  background-color: #343a40;
  color: white;
`;

const FooterLogo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  display: flex;
  align-items: center;
  margin-bottom: 1rem;

  svg {
    margin-right: 0.5rem;
  }
`;

const FooterDescription = styled.p`
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1.5rem;
`;

const FooterTitle = styled.h5`
  font-weight: 600;
  margin-bottom: 1.25rem;
`;

const FooterLink = styled.a`
  display: block;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 0.75rem;
  text-decoration: none;

  &:hover {
    color: white;
    text-decoration: none;
  }
`;

const Copyright = styled.div`
  text-align: center;
  padding-top: 2rem;
  margin-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.5);
`;

export default function Home() {
  return (
    <>
      <Head>
        <title>Splitwise Clone - Split expenses with friends</title>
        <meta
          name="description"
          content="Split expenses with friends and track balances easily"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header expand="lg">
        <Container>
          <Navbar.Brand href="/">
            <Logo>
              <FiDollarSign size={24} />
              Splitwise
            </Logo>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="me-auto">
              <NavLink href="#features">Features</NavLink>
              <NavLink href="#testimonials">Testimonials</NavLink>
              <NavLink href="#faq">FAQ</NavLink>
            </Nav>
            <Nav>
              {/* Fixed Button Links */}
              <HeaderButton href="/login" variant="outline-primary">
                Log in
              </HeaderButton>
              <HeaderButton href="/register" variant="primary">
                Sign up
              </HeaderButton>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Header>

      <HeroSection>
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-5 mb-lg-0">
              <HeroTitle>Split expenses with friends</HeroTitle>
              <HeroSubtitle>
                Keep track of your shared expenses and balances with housemates,
                trips, groups, friends, and family. Never worry about "who owes
                who" again.
              </HeroSubtitle>
              <div>
                {/* Fixed Button Links */}
                <ActionButton href="/register" variant="primary">
                  Sign up for free
                </ActionButton>
                <ActionButton href="/login" variant="outline-primary">
                  Log in
                </ActionButton>
              </div>
            </Col>
            <Col lg={6}>
              {/* Fixed image path */}
              <img
                src="https://via.placeholder.com/600x400?text=Splitwise+App"
                alt="Split expenses with friends"
                className="img-fluid rounded shadow-lg"
              />
            </Col>
          </Row>
        </Container>
      </HeroSection>

      <FeatureSection id="features">
        <Container>
          <SectionTitle>Features</SectionTitle>
          <Row>
            <Col md={4}>
              <FeatureCard>
                <FeatureIcon color="#16B174">
                  <FiUsers />
                </FeatureIcon>
                <FeatureTitle>Share group expenses</FeatureTitle>
                <FeatureDescription>
                  Create groups for trips, apartments, and more. Add expenses
                  and split them equally or with custom amounts.
                </FeatureDescription>
              </FeatureCard>
            </Col>
            <Col md={4}>
              <FeatureCard>
                <FeatureIcon color="#5BC5FA">
                  <FiDollarSign />
                </FeatureIcon>
                <FeatureTitle>Track balances</FeatureTitle>
                <FeatureDescription>
                  Keep track of who owes who and how much. See total balances
                  and individual IOUs at a glance.
                </FeatureDescription>
              </FeatureCard>
            </Col>
            <Col md={4}>
              <FeatureCard>
                <FeatureIcon color="#FF5252">
                  <FiCreditCard />
                </FeatureIcon>
                <FeatureTitle>Settle up</FeatureTitle>
                <FeatureDescription>
                  Record payments and settle debts easily. Keep everyone on the
                  same page about shared finances.
                </FeatureDescription>
              </FeatureCard>
            </Col>
          </Row>
        </Container>
      </FeatureSection>

      <TestimonialSection id="testimonials">
        <Container>
          <SectionTitle>What our users say</SectionTitle>
          <Row>
            <Col lg={4} md={6}>
              <TestimonialCard>
                <TestimonialText>
                  "This app has saved my friendships. No more awkward money
                  conversations after trips. We just split everything through
                  the app!"
                </TestimonialText>
                <TestimonialAuthor>
                  <Avatar>JD</Avatar>
                  <AuthorInfo>
                    <AuthorName>John Doe</AuthorName>
                    <AuthorTitle>Frequent Traveler</AuthorTitle>
                  </AuthorInfo>
                </TestimonialAuthor>
              </TestimonialCard>
            </Col>
            <Col lg={4} md={6}>
              <TestimonialCard>
                <TestimonialText>
                  "Managing expenses with my roommates used to be a nightmare.
                  Now it's all organized in one place and we can see exactly who
                  owes what."
                </TestimonialText>
                <TestimonialAuthor>
                  <Avatar>AS</Avatar>
                  <AuthorInfo>
                    <AuthorName>Alex Smith</AuthorName>
                    <AuthorTitle>College Student</AuthorTitle>
                  </AuthorInfo>
                </TestimonialAuthor>
              </TestimonialCard>
            </Col>
            <Col lg={4} md={6}>
              <TestimonialCard>
                <TestimonialText>
                  "The simplicity of this app is its biggest strength. It takes
                  seconds to add expenses and the balance calculations are
                  always accurate."
                </TestimonialText>
                <TestimonialAuthor>
                  <Avatar>MJ</Avatar>
                  <AuthorInfo>
                    <AuthorName>Mary Johnson</AuthorName>
                    <AuthorTitle>Family Organizer</AuthorTitle>
                  </AuthorInfo>
                </TestimonialAuthor>
              </TestimonialCard>
            </Col>
          </Row>
        </Container>
      </TestimonialSection>

      <CTASection>
        <Container>
          <CTATitle>Ready to split expenses with friends?</CTATitle>
          <CTASubtitle>
            Join thousands of users who are already managing their shared
            expenses easily.
          </CTASubtitle>
          {/* Fixed Button Link */}
          <CTAButton href="/register" size="lg">
            Get started for free <FiArrowRight />
          </CTAButton>
        </Container>
      </CTASection>

      <Footer>
        <Container>
          <Row>
            <Col lg={4} className="mb-4 mb-lg-0">
              <FooterLogo>
                <FiDollarSign />
                Splitwise
              </FooterLogo>
              <FooterDescription>
                Split expenses with friends and family. Keep track of shared
                expenses and balances with housemates, trips, groups, and more.
              </FooterDescription>
            </Col>
            <Col md={6} lg={2} className="mb-4 mb-lg-0">
              <FooterTitle>Company</FooterTitle>
              <FooterLink href="#">About Us</FooterLink>
              <FooterLink href="#">Blog</FooterLink>
              <FooterLink href="#">Careers</FooterLink>
              <FooterLink href="#">Press</FooterLink>
            </Col>
            <Col md={6} lg={3} className="mb-4 mb-lg-0">
              <FooterTitle>Resources</FooterTitle>
              <FooterLink href="#">Help Center</FooterLink>
              <FooterLink href="#">Community</FooterLink>
              <FooterLink href="#">Developer API</FooterLink>
              <FooterLink href="#">Mobile Apps</FooterLink>
            </Col>
            <Col md={6} lg={3}>
              <FooterTitle>Legal</FooterTitle>
              <FooterLink href="#">Terms of Service</FooterLink>
              <FooterLink href="#">Privacy Policy</FooterLink>
              <FooterLink href="#">Cookie Policy</FooterLink>
              <FooterLink href="#">Security</FooterLink>
            </Col>
          </Row>
          <Copyright>
            &copy; {new Date().getFullYear()} Splitwise Clone. All rights
            reserved.
          </Copyright>
        </Container>
      </Footer>
    </>
  );
}
