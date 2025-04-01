import { useState, useContext } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Alert,
} from "react-bootstrap";
import styled from "styled-components";
import { BiDollar, BiEnvelope, BiLock } from "react-icons/bi";
import { FiDollarSign, FiMail, FiLock, FiAlertCircle } from "react-icons/fi";
import AuthContext from "../src/contexts/AuthContext"; // This might be the issue

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  background-color: #f6f8fa;
  padding: 2rem 0;
`;

const LoginCard = styled(Card)`
  border: none;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const CardHeader = styled(Card.Header)`
  background-color: white;
  padding: 1.5rem;
  border-bottom: 1px solid #e9ebed;
  text-align: center;
`;

const Logo = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #16b174;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;

  svg {
    margin-right: 0.5rem;
  }
`;

const InputGroup = styled.div`
  position: relative;
  margin-bottom: 1.5rem;

  .form-control {
    padding-left: 3rem;
    height: 48px;
    background-color: #f9fafb;
    border: 1px solid #e9ebed;
    border-radius: 8px;

    &:focus {
      box-shadow: 0 0 0 0.25rem rgba(22, 177, 116, 0.25);
      border-color: #16b174;
    }
  }

  .icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #6e7a88;
  }
`;

const LoginButton = styled(Button)`
  height: 48px;
  font-weight: 500;
  font-size: 1rem;
`;

const ForgotPassword = styled.div`
  text-align: right;
  margin-bottom: 1.5rem;

  a {
    color: #16b174;
    text-decoration: none;
    font-size: 0.875rem;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;

  &::before,
  &::after {
    content: "";
    flex: 1;
    border-bottom: 1px solid #e9ebed;
  }

  span {
    padding: 0 1rem;
    color: #6e7a88;
    font-size: 0.875rem;
  }
`;

const Footer = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.875rem;
  color: #6e7a88;

  a {
    color: #16b174;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });

    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setAlert({ type: "", message: "" });

    try {
      // Mock authentication for now
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check if it's a test account
      if (form.email === "test@example.com" && form.password === "password") {
        setIsSubmitted(true);
        setAlert({ type: "success", message: "Login successful!" });

        // Redirect to dashboard
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } else {
        setAlert({ type: "danger", message: "Invalid email or password" });
      }
    } catch (error) {
      setAlert({
        type: "danger",
        message: error.message || "Failed to login. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login - Splitwise</title>
        <meta name="description" content="Log in to your Splitwise account" />
      </Head>

      <LoginContainer>
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <LoginCard>
                <CardHeader>
                  <Logo>
                    <BiDollar size={32} />
                    Splitwise
                  </Logo>
                  <h4>Welcome back!</h4>
                  <p className="text-muted mb-0">
                    Sign in to your account to continue
                  </p>
                </CardHeader>

                <Card.Body className="p-4">
                  {alert.message && (
                    <Alert variant={alert.type} className="mb-4">
                      {alert.message}
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit}>
                    <InputGroup>
                      <div className="icon">
                        <BiEnvelope size={18} />
                      </div>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="Email address"
                        value={form.email}
                        onChange={handleChange}
                        isInvalid={!!errors.email}
                        disabled={isLoading || isSubmitted}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    </InputGroup>

                    <InputGroup>
                      <div className="icon">
                        <BiLock size={18} />
                      </div>
                      <Form.Control
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        isInvalid={!!errors.password}
                        disabled={isLoading || isSubmitted}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.password}
                      </Form.Control.Feedback>
                    </InputGroup>

                    <ForgotPassword>
                      <a href="/forgot-password">Forgot password?</a>
                    </ForgotPassword>

                    <LoginButton
                      type="submit"
                      variant="primary"
                      className="w-100"
                      disabled={isLoading || isSubmitted}
                    >
                      {isLoading ? "Signing in..." : "Sign in"}
                    </LoginButton>
                  </Form>

                  <Divider>
                    <span>OR</span>
                  </Divider>

                  <Button
                    variant="outline-secondary"
                    className="w-100 mb-3"
                    disabled={isLoading || isSubmitted}
                  >
                    Continue with Google
                  </Button>

                  <Footer>
                    Don't have an account? <a href="/register">Sign up</a>
                  </Footer>
                </Card.Body>
              </LoginCard>

              <div className="text-center mt-4">
                <a href="/" className="text-muted">
                  ← Back to home
                </a>
              </div>
            </Col>
          </Row>
        </Container>
      </LoginContainer>
    </>
  );
}
