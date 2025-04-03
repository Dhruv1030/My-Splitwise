import React, { useContext } from "react";
import Head from "next/head";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useRouter } from "next/router";
import { ExpenseContext } from "../../src/contexts/ExpenseContext";
import BalanceSummary from "../../src/components/settlements/BalanceSummary";
import SettlementList from "../../src/components/settlements/SettlementList";

const SettlementsPage = () => {
  const router = useRouter();
  const { calculateBalances } = useContext(ExpenseContext);

  // Check if there are any balances to settle
  const hasBalances = calculateBalances().length > 0;

  return (
    <>
      <Head>
        <title>Settlements | Splitwise Clone</title>
      </Head>

      <Container className="py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Settlements</h1>
          <Button
            variant="primary"
            onClick={() => router.push("/settlements/new")}
            disabled={!hasBalances}
          >
            Settle Up
          </Button>
        </div>

        <Row>
          <Col lg={4} className="mb-4">
            <BalanceSummary />
          </Col>

          <Col lg={8}>
            <SettlementList />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default SettlementsPage;
