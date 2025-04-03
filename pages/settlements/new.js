import React from "react";
import Head from "next/head";
import { Container, Row, Col } from "react-bootstrap";
import SettlementForm from "../../src/components/settlements/SettlementForm";

const NewSettlementPage = () => {
  return (
    <>
      <Head>
        <title>Settle Up | Splitwise Clone</title>
      </Head>

      <Container className="py-4">
        <Row>
          <Col lg={8} className="mx-auto">
            <h1 className="mb-4">Settle Up</h1>
            <SettlementForm />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default NewSettlementPage;
