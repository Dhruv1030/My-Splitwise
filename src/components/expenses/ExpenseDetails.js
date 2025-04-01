import React, { useContext } from "react";
import { Card, Row, Col, ListGroup, Badge, Button } from "react-bootstrap";
import { useRouter } from "next/router";
import { AuthContext } from "../../contexts/AuthContext";
import { ExpenseContext } from "../../contexts/ExpenseContext";

const ExpenseDetail = ({ expenseId }) => {
  const router = useRouter();
  const { currentUser } = useContext(AuthContext);
  const { expenses, getFriendById, getGroupById, deleteExpense } =
    useContext(ExpenseContext);

  // Find the expense by ID
  const expense = expenses.find((e) => e.id === expenseId);

  if (!expense) {
    return (
      <Card className="text-center p-5">
        <p className="mb-0">Expense not found</p>
        <Button
          variant="link"
          className="mt-3"
          onClick={() => router.push("/expenses")}
        >
          Back to Expenses
        </Button>
      </Card>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const paidByUser = expense.paidBy === currentUser.id;
  const paidByName = paidByUser
    ? "You"
    : getFriendById(expense.paidBy)?.name || "Unknown";

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      deleteExpense(expense.id);
      router.push("/expenses");
    }
  };

  return (
    <Card className="shadow-sm">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Expense Details</h5>
        <div>
          <Button
            variant="outline-primary"
            size="sm"
            className="me-2"
            onClick={() => router.push(`/expenses/edit/${expense.id}`)}
          >
            Edit
          </Button>
          <Button variant="outline-danger" size="sm" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        <Row className="mb-4">
          <Col md={6}>
            <h4>{expense.description}</h4>
            <p className="text-muted mb-0">
              {formatDate(expense.date)}
              {expense.groupId && (
                <>
                  {" • "}
                  <Badge bg="light" text="dark">
                    {getGroupById(expense.groupId)?.name || "Group"}
                  </Badge>
                </>
              )}
            </p>
          </Col>
          <Col md={6} className="text-md-end">
            <h3 className="text-primary">{formatCurrency(expense.amount)}</h3>
            <p className="mb-0">Paid by {paidByName}</p>
          </Col>
        </Row>

        {expense.notes && (
          <Card className="bg-light mb-4">
            <Card.Body>
              <h6>Notes</h6>
              <p className="mb-0">{expense.notes}</p>
            </Card.Body>
          </Card>
        )}

        <h6 className="mb-3">Split Details</h6>
        <ListGroup className="mb-4">
          {expense.participants.map((participant) => {
            const isCurrentUser = participant.id === currentUser.id;
            const name = isCurrentUser
              ? "You"
              : getFriendById(participant.id)?.name || "Unknown";

            return (
              <ListGroup.Item
                key={participant.id}
                className="d-flex justify-content-between align-items-center"
              >
                <span>{name}</span>
                <Badge
                  bg={participant.id === expense.paidBy ? "success" : "danger"}
                >
                  {participant.id === expense.paidBy
                    ? "Paid " + formatCurrency(expense.amount)
                    : "Owes " + formatCurrency(participant.amount)}
                </Badge>
              </ListGroup.Item>
            );
          })}
        </ListGroup>

        <div className="d-flex justify-content-between">
          <Button variant="secondary" onClick={() => router.back()}>
            Back
          </Button>
          {paidByUser && (
            <Button
              variant="success"
              onClick={() => router.push("/settlements/new")}
            >
              Settle Up
            </Button>
          )}
        </div>
      </Card.Body>
      <Card.Footer className="text-muted">
        Created {new Date(expense.timestamp).toLocaleString()}
      </Card.Footer>
    </Card>
  );
};

export default ExpenseDetail;
