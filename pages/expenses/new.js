import React from "react";
import Head from "next/head";
import { Container, Row, Col } from "react-bootstrap";
import AddExpenseForm from "../../src/components/expenses/AddExpenseForm";

const NewExpensePage = () => {
  return (
    <>
      <Head>
        <title>Add New Expense | Splitwise Clone</title>
      </Head>

      <Container className="py-4">
        <Row>
          <Col lg={8} className="mx-auto">
            <h1 className="mb-4">Add New Expense</h1>
            <AddExpenseForm />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default NewExpensePage;
