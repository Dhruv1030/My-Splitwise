import { useState } from "react";
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
import { useAuth } from "../src/contexts/AuthContext";

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  background-color: #f8f9fa;
  padding: 2rem 0;
`;

const LoginCard = styled(Card)`
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
`;

const CardHeader = styled.div`
  background-color: #fff;
  padding: 2rem;
  text-align: center;
  border-bottom: 1px solid #eee;
`;

const Logo = styled.div`
  color: #1cc29f;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const InputGroup = styled(Form.Group)`
  position: relative;
  margin-bottom: 1.5rem;

  .icon {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: #6c757d;
    z-index: 2;
  }

  .form-control {
    padding-left: 45px;
  }
`;

const LoginButton = styled(Button)`
  padding: 0.75rem;
  font-weight: 500;
`;

const ForgotPassword = styled.div`
  text-align: right;
  margin-bottom: 1rem;

  a {
    color: #6c757d;
    text-decoration: none;
    &:hover {
      color: #1cc29f;
    }
  }
`;

const Divider = styled.div`
  text-align: center;
  margin: 1.5rem 0;
  position: relative;

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    width: 45%;
    height: 1px;
    background-color: #dee2e6;
  }

  &::before {
    left: 0;
  }

  &::after {
    right: 0;
  }

  span {
    background-color: #fff;
    padding: 0 1rem;
    color: #6c757d;
  }
`;

const Footer = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  color: #6c757d;

  a {
    color: #1cc29f;
    text-decoration: none;
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
  const [alert, setAlert] = useState({ type: "", message: "" });

  const router = useRouter();
  const { login, signInWithGoogle } = useAuth(); // Get auth methods from useAuth hook

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email is invalid";
    }

    // Password validation
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
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
      await login(form.email, form.password);
      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setAlert({
        type: "danger",
        message:
          getErrorMessage(error.code) || "Failed to login. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setAlert({ type: "", message: "" });
      await signInWithGoogle();
      router.push("/dashboard");
    } catch (error) {
      console.error("Google sign in error:", error);
      setAlert({
        type: "danger",
        message: "Failed to sign in with Google. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get user-friendly error messages
  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case "auth/user-not-found":
        return "No account exists with this email";
      case "auth/wrong-password":
        return "Invalid password";
      case "auth/too-many-requests":
        return "Too many failed attempts. Please try again later";
      case "auth/invalid-email":
        return "Invalid email format";
      default:
        return "An error occurred during login";
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
                    <Alert
                      variant={alert.type}
                      className="mb-4"
                      dismissible
                      onClose={() => setAlert({ type: "", message: "" })}
                    >
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
                        disabled={isLoading}
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
                        disabled={isLoading}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.password}
                      </Form.Control.Feedback>
                    </InputGroup>

                    <ForgotPassword>
                      <Link href="/forgot-password">Forgot password?</Link>
                    </ForgotPassword>

                    <LoginButton
                      type="submit"
                      variant="primary"
                      className="w-100"
                      disabled={isLoading}
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
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                  >
                    Continue with Google
                  </Button>

                  <Footer>
                    Don't have an account? <Link href="/register">Sign up</Link>
                  </Footer>
                </Card.Body>
              </LoginCard>

              <div className="text-center mt-4">
                <Link href="/" className="text-muted">
                  ← Back to home
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </LoginContainer>
    </>
  );
}
