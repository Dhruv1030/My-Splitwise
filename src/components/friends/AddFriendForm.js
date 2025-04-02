import React, { useState, useContext } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useRouter } from "next/router";
import { ExpenseContext } from "../../contexts/ExpenseContext";

const AddFriendForm = () => {
  const router = useRouter();
  const { addFriend, friends } = useContext(ExpenseContext);

  const [friendData, setFriendData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFriendData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate name
    if (!friendData.name.trim()) {
      newErrors.name = "Name is required";
    }

    // Validate email
    if (!friendData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(friendData.email)) {
      newErrors.email = "Email is invalid";
    }

    // Check if email already exists
    const emailExists = friends.some(
      (friend) => friend.email.toLowerCase() === friendData.email.toLowerCase()
    );

    if (emailExists) {
      newErrors.email = "A friend with this email already exists";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (validateForm()) {
      // Add the friend
      addFriend(friendData);

      // Navigate back to friends list
      router.push("/friends");
    }
  };

  return (
    <Card className="shadow-sm">
      <Card.Header as="h5">Add a Friend</Card.Header>
      <Card.Body>
        {submitted && Object.keys(errors).length > 0 && (
          <Alert variant="danger">
            Please fix the errors below to continue.
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={friendData.name}
              onChange={handleChange}
              isInvalid={submitted && !!errors.name}
              placeholder="Enter your friend's name"
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={friendData.email}
              onChange={handleChange}
              isInvalid={submitted && !!errors.email}
              placeholder="Enter your friend's email"
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              We won't send any emails to your friend yet. This is just to
              identify them in the app.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Phone Number (Optional)</Form.Label>
            <Form.Control
              type="tel"
              name="phone"
              value={friendData.phone}
              onChange={handleChange}
              placeholder="Enter your friend's phone number"
            />
          </Form.Group>

          <div className="d-flex justify-content-end">
            <Button
              variant="secondary"
              className="me-2"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Add Friend
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default AddFriendForm;
