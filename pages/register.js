import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Alert,
  InputGroup,
} from "react-bootstrap";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple validation
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      alert("Please fill in all fields");
      return;
    }

    // Simple navigation
    router.push("/dashboard");
  };

  return (
    <>
      <Head>
        <title>Sign Up - Splitwise</title>
      </Head>

      <div
        style={{
          minHeight: "100vh",
          padding: "2rem 0",
          backgroundColor: "#f6f8fa",
        }}
      >
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card>
                <Card.Header className="bg-white text-center">
                  <div className="d-flex align-items-center justify-content-center mb-2">
                    <span className="text-success me-2 fs-3">💰</span>{" "}
                    {/* Currency emoji instead of icon */}
                    <h2 className="text-success mb-0">Splitwise</h2>
                  </div>
                  <h4>Create your account</h4>
                </Card.Header>

                <Card.Body>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Full Name</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>👤</InputGroup.Text>{" "}
                        {/* Person emoji instead of icon */}
                        <Form.Control
                          type="text"
                          name="name"
                          placeholder="Full Name"
                          value={form.name}
                          onChange={handleChange}
                        />
                      </InputGroup>
                    </Form.Group>

                    {/* Repeat for other form fields using appropriate emoji */}
                    <Form.Group className="mb-3">
                      <Form.Label>Email address</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>✉️</InputGroup.Text>
                        <Form.Control
                          type="email"
                          name="email"
                          placeholder="Email address"
                          value={form.email}
                          onChange={handleChange}
                        />
                      </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>🔒</InputGroup.Text>
                        <Form.Control
                          type="password"
                          name="password"
                          placeholder="Password"
                          value={form.password}
                          onChange={handleChange}
                        />
                      </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Confirm Password</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>🔒</InputGroup.Text>
                        <Form.Control
                          type="password"
                          name="confirmPassword"
                          placeholder="Confirm Password"
                          value={form.confirmPassword}
                          onChange={handleChange}
                        />
                      </InputGroup>
                    </Form.Group>

                    <Button type="submit" variant="primary" className="w-100">
                      Create Account
                    </Button>
                  </Form>

                  <div className="text-center mt-3">
                    <p>
                      Already have an account? <a href="/login">Sign in</a>
                    </p>
                  </div>
                </Card.Body>
              </Card>

              <div className="text-center mt-4">
                <a href="/" className="text-muted">
                  ← Back to home
                </a>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}
