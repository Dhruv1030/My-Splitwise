import React from "react";
import Head from "next/head";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useRouter } from "next/router";
import FriendList from "../../src/components/friends/FriendList";

const FriendsPage = () => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Friends | Splitwise Clone</title>
      </Head>

      <Container className="py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Friends</h1>
          <Button variant="primary" onClick={() => router.push("/friends/add")}>
            Add Friend
          </Button>
        </div>

        <Row>
          <Col>
            <FriendList />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default FriendsPage;
