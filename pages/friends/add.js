// import React from "react";
// import Head from "next/head";
// import { Container, Row, Col } from "react-bootstrap";
// import AddFriendForm from "../../src/components/friends/AddFriendForm";

// const AddFriendPage = () => {
//   return (
//     <>
//       <Head>
//         <title>Add Friend | Splitwise Clone</title>
//       </Head>

//       <Container className="py-4">
//         <Row>
//           <Col lg={8} className="mx-auto">
//             <h1 className="mb-4">Add a Friend</h1>
//             <AddFriendForm />
//           </Col>
//         </Row>
//       </Container>
//     </>
//   );
// };

// export default AddFriendPage;

import React, { useState, useContext } from "react";
import Head from "next/head";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useRouter } from "next/router";
import { ExpenseContext } from "../../src/contexts/ExpenseContext";

const AddFriendPage = () => {
  const router = useRouter();
  const { addFriend } = useContext(ExpenseContext) || {};

  const [friendData, setFriendData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFriendData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (typeof addFriend === "function") {
      addFriend(friendData);
      router.push("/friends");
    } else {
      alert("addFriend function is not available");
    }
  };

  return (
    <>
      <Head>
        <title>Add Friend | Splitwise Clone</title>
      </Head>

      <Container className="py-4">
        <Row>
          <Col lg={8} className="mx-auto">
            <h1 className="mb-4">Add a Friend</h1>

            <Card className="shadow-sm">
              <Card.Header as="h5">Add a Friend</Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={friendData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your friend's name"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={friendData.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter your friend's email"
                    />
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
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AddFriendPage;
