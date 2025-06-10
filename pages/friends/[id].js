import React from "react";
import Head from "next/head";
import { Container, Row, Col } from "react-bootstrap";
import { useRouter } from "next/router";
import FriendDetail from "../../src/components/friends/FriendDetail";

const FriendDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  if (!id) return <p>Loading friend…</p>;

  return (
    <>
      <Head>
        <title>Friend Details | Splitwise Clone</title>
      </Head>

      <Container className="py-4">
        <Row>
          <Col lg={8} className="mx-auto">
            <FriendDetail friendId={id} />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default FriendDetailPage;
