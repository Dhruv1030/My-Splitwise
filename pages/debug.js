import React, { useContext, useState } from "react";
import Head from "next/head";
import { Container, Row, Col, Button, Card, Alert } from "react-bootstrap";
import { AuthContext } from "../src/contexts/AuthContext";
import { ExpenseContext } from "../src/contexts/ExpenseContext";
import {
  createMockExpense,
  createSampleExpenses,
} from "../src/utils/MockExpenseFactory";
import TestBalanceCalculation from "../src/debug/TestBalanceCalculation";

const DebugPage = () => {
  const { currentUser } = useContext(AuthContext);
  const { friends, expenses, addExpense, setExpenses } =
    useContext(ExpenseContext);
  const [message, setMessage] = useState("");

  const addSampleExpenses = () => {
    if (!currentUser?.id || friends.length === 0) {
      setMessage("You need to add friends first!");
      return;
    }

    const friendIds = friends.map((f) => f.id);
    const sampleExpenses = createSampleExpenses(currentUser.id, friendIds);

    // Add each expense
    sampleExpenses.forEach((expense) => {
      addExpense(expense);
    });

    setMessage(
      `Added ${sampleExpenses.length} sample expenses with proper participant structure`
    );
  };

  const clearAllExpenses = () => {
    if (window.confirm("Are you sure you want to clear all expenses?")) {
      setExpenses([]);
      setMessage("All expenses cleared");
    }
  };

  // Display raw expense data
  const dumpExpenseData = () => {
    setMessage(JSON.stringify(expenses, null, 2));
  };

  return (
    <>
      <Head>
        <title>Debug | Splitwise Clone</title>
      </Head>

      <Container className="py-4">
        <h1 className="mb-4">Debug Tools</h1>

        <Card className="mb-4">
          <Card.Header>Debug Actions</Card.Header>
          <Card.Body>
            <Row>
              <Col>
                <Button
                  variant="primary"
                  onClick={addSampleExpenses}
                  className="me-2 mb-2"
                >
                  Add Sample Expenses
                </Button>

                <Button
                  variant="danger"
                  onClick={clearAllExpenses}
                  className="me-2 mb-2"
                >
                  Clear All Expenses
                </Button>

                <Button
                  variant="secondary"
                  onClick={dumpExpenseData}
                  className="mb-2"
                >
                  Dump Expense Data
                </Button>
              </Col>
            </Row>

            {message && (
              <Alert variant="info" className="mt-3">
                <pre
                  style={{
                    whiteSpace: "pre-wrap",
                    maxHeight: "400px",
                    overflow: "auto",
                  }}
                >
                  {message}
                </pre>
              </Alert>
            )}
          </Card.Body>
        </Card>

        <TestBalanceCalculation />
      </Container>
    </>
  );
};

export default DebugPage;
