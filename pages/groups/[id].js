import React from "react";
import Head from "next/head";
import { Container, Row, Col } from "react-bootstrap";
import { useRouter } from "next/router";
import GroupDetail from "../../src/components/groups/GroupDetails";

const GroupDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <Head>
        <title>Group Details | Splitwise Clone</title>
      </Head>

      <Container className="py-4">
        <Row>
          <Col lg={10} className="mx-auto">
            <GroupDetail groupId={id} />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default GroupDetailPage;
