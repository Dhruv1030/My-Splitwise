// Create this as a temporary file - e.g., src/debug/TestBalanceCalculation.js
import React, { useContext, useEffect, useState } from "react";
import { Card, Button, Alert } from "react-bootstrap";
import { ExpenseContext } from "../contexts/ExpenseContext";
import { AuthContext } from "../contexts/AuthContext";

const TestBalanceCalculation = () => {
  const { expenses, friends, addExpense } = useContext(ExpenseContext);
  const { currentUser } = useContext(AuthContext);
  const [debugInfo, setDebugInfo] = useState("");

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Debug function to manually calculate balances
  const calculateTestBalances = () => {
    const results = [];

    // Output the current expenses
    let output = `Current User ID: ${currentUser?.id}\n`;
    output += `Number of Expenses: ${expenses.length}\n`;
    output += `Number of Friends: ${friends.length}\n\n`;

    // Check each expense
    expenses.forEach((expense, index) => {
      output += `Expense ${index + 1}: ${expense.description}\n`;
      output += `  Amount: ${formatCurrency(expense.amount)}\n`;
      output += `  Paid By: ${
        expense.paidBy === currentUser?.id ? "You" : "Friend"
      }\n`;
      output += `  Participants: ${expense.participants?.length || 0}\n`;

      if (expense.participants?.length > 0) {
        expense.participants.forEach((participant) => {
          output += `    - ID: ${participant.id} (${
            participant.id === currentUser?.id ? "You" : "Friend"
          })\n`;
          output += `      Amount: ${formatCurrency(
            participant.amount || 0
          )}\n`;
        });
      }

      // Simple balance calculation for this expense
      if (expense.paidBy === currentUser?.id) {
        // You paid, others owe you
        const otherParticipants =
          expense.participants?.filter((p) => p.id !== currentUser?.id) || [];
        const totalOwed = otherParticipants.reduce(
          (sum, p) => sum + parseFloat(p.amount || 0),
          0
        );

        if (totalOwed > 0) {
          output += `  Others owe you: ${formatCurrency(totalOwed)}\n`;
        } else {
          output += `  No money owed (self expense)\n`;
        }
      } else if (expense.participants?.some((p) => p.id === currentUser?.id)) {
        // Someone else paid, you might owe them
        const yourAmount =
          expense.participants.find((p) => p.id === currentUser?.id)?.amount ||
          0;

        if (yourAmount > 0) {
          output += `  You owe: ${formatCurrency(yourAmount)}\n`;
        } else {
          output += `  No money owed by you\n`;
        }
      }

      output += "\n";
    });

    setDebugInfo(output);
  };

  // Create a test expense with proper participants
  const addTestExpense = () => {
    if (friends.length === 0) {
      setDebugInfo("You need to add friends first!");
      return;
    }

    // Get the first friend
    const firstFriend = friends[0];

    // Create a test expense
    const testExpense = {
      description: "Test Expense",
      amount: 100,
      date: new Date().toISOString().split("T")[0],
      paidBy: currentUser?.id,
      splitType: "equal",
      participants: [
        {
          id: currentUser?.id,
          amount: 50,
        },
        {
          id: firstFriend.id,
          amount: 50,
        },
      ],
      notes: "This is a test expense",
    };

    addExpense(testExpense);
    setDebugInfo(
      `Added test expense with ${currentUser?.id} and ${firstFriend.id} as participants`
    );
  };

  return (
    <Card className="my-4">
      <Card.Header>Debug Balance Calculation</Card.Header>
      <Card.Body>
        <div className="mb-3">
          <Button
            variant="primary"
            onClick={calculateTestBalances}
            className="me-2"
          >
            Debug Current Expenses
          </Button>

          <Button variant="success" onClick={addTestExpense}>
            Add Test Expense
          </Button>
        </div>

        <Alert variant="info">
          <pre
            style={{
              whiteSpace: "pre-wrap",
              maxHeight: "400px",
              overflow: "auto",
            }}
          >
            {debugInfo || "Click a button to debug"}
          </pre>
        </Alert>
      </Card.Body>
    </Card>
  );
};

export default TestBalanceCalculation;
