import React from "react";
import Head from "next/head";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useRouter } from "next/router";
import GroupList from "../../src/components/groups/GroupList";

const GroupsPage = () => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Groups | Splitwise Clone</title>
      </Head>

      <Container className="py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Groups</h1>
          <Button variant="primary" onClick={() => router.push("/groups/new")}>
            Create Group
          </Button>
        </div>

        <Row>
          <Col>
            <GroupList />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default GroupsPage;
