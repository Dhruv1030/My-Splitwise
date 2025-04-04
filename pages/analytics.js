import React from "react";
import Head from "next/head";
import { Container, Row, Col } from "react-bootstrap";
import ExpenseChart from "../src/components/analytics/ExpenseChart";
import FriendsBalanceChart from "../src/components/analytics/FriendsBalanceChart";
import TransactionHistoryChart from "../src/components/analytics/TransactionHistoryChart";

const AnalyticsPage = () => {
  return (
    <>
      <Head>
        <title>Analytics | Splitwise Clone</title>
      </Head>

      <Container className="py-4">
        <h1 className="mb-4">Analytics</h1>

        <Row>
          <Col lg={12}>
            <ExpenseChart />
          </Col>
        </Row>

        <Row>
          <Col lg={6}>
            <FriendsBalanceChart />
          </Col>

          <Col lg={6}>
            <TransactionHistoryChart />
          </Col>
        </Row>

        <div className="text-center text-muted pt-3 pb-5">
          <p>
            These visualizations help you understand your spending patterns and
            balances with friends.
            <br />
            Add more expenses to see more detailed analytics.
          </p>
        </div>
      </Container>
    </>
  );
};

export default AnalyticsPage;
