import React from "react";
import Head from "next/head";
import { Container, Row, Col } from "react-bootstrap";
import GroupForm from "../../src/components/groups/GroupForm";

const NewGroupPage = () => {
  return (
    <>
      <Head>
        <title>Create Group | Splitwise Clone</title>
      </Head>

      <Container className="py-4">
        <Row>
          <Col lg={8} className="mx-auto">
            <h1 className="mb-4">Create Group</h1>
            <GroupForm />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default NewGroupPage;
