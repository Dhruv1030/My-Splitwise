import React from "react";
import Head from "next/head";
import { Container, Row, Col } from "react-bootstrap";
import { useRouter } from "next/router";
import ExpenseDetail from "../../src/components/expenses/ExpenseDetail";

const ExpenseDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <Head>
        <title>Expense Details | Splitwise Clone</title>
      </Head>

      <Container className="py-4">
        <Row>
          <Col lg={8} className="mx-auto">
            <ExpenseDetail expenseId={id} />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ExpenseDetailPage;
