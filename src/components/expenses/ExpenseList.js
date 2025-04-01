import React, { useContext } from "react";
import { ListGroup, Badge } from "react-bootstrap";
import { useRouter } from "next/router";
import { AuthContext } from "../../contexts/AuthContext";
import { ExpenseContext } from "../../contexts/ExpenseContext";

const ExpenseList = ({ expenses, limit }) => {
  const router = useRouter();
  const { currentUser } = useContext(AuthContext);
  const { getFriendById, getGroupById } = useContext(ExpenseContext);

  // Apply limit if provided
  const displayExpenses = limit ? expenses.slice(0, limit) : expenses;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <ListGroup variant="flush">
      {displayExpenses.length > 0 ? (
        displayExpenses.map((expense) => {
          // Check if this expense has the expected structure
          // If not, display a basic version
          if (!expense.participants) {
            return (
              <ListGroup.Item
                key={expense.id}
                action
                onClick={() => router.push(`/expenses/${expense.id}`)}
                className="px-4 py-3"
              >
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h6 className="mb-0">
                          {expense.description || "Expense"}
                        </h6>
                        <small className="text-muted">
                          {expense.date ? formatDate(expense.date) : "No date"}
                        </small>
                      </div>
                      <div className="text-end">
                        <h6 className="mb-0">
                          {formatCurrency(expense.amount || 0)}
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
              </ListGroup.Item>
            );
          }

          const paidByUser = expense.paidBy === currentUser?.id;
          const paidByName = paidByUser
            ? "You"
            : (getFriendById && getFriendById(expense.paidBy)?.name) ||
              "Someone";

          // Calculate what current user owes or is owed
          let userAmount = 0;

          if (expense.participants) {
            if (paidByUser) {
              // User paid, so they are owed by others
              const userParticipantAmount =
                expense.participants.find((p) => p.id === currentUser?.id)
                  ?.amount || 0;

              userAmount = expense.amount - userParticipantAmount;
            } else {
              // Someone else paid, current user might owe
              userAmount =
                expense.participants.find((p) => p.id === currentUser?.id)
                  ?.amount || 0;
            }
          }

          const isUserOwed = paidByUser && userAmount > 0;
          const userOwes = !paidByUser && userAmount > 0;

          return (
            <ListGroup.Item
              key={expense.id}
              action
              onClick={() => router.push(`/expenses/${expense.id}`)}
              className="px-4 py-3"
            >
              <div className="d-flex align-items-center">
                <div className="me-3">
                  <div
                    className={`bg-${
                      expense.isPayment ? "success" : "primary"
                    } rounded-circle d-flex align-items-center justify-content-center`}
                    style={{ width: 40, height: 40, color: "white" }}
                  >
                    {expense.isPayment ? "P" : "E"}
                  </div>
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h6 className="mb-0">{expense.description}</h6>
                      <small className="text-muted">
                        {formatDate(expense.date)}
                        {expense.groupId && getGroupById && (
                          <>
                            {" • "}
                            <Badge bg="light" text="dark">
                              {getGroupById(expense.groupId)?.name || "Group"}
                            </Badge>
                          </>
                        )}
                      </small>
                    </div>
                    <div className="text-end">
                      <h6 className="mb-0">{formatCurrency(expense.amount)}</h6>
                      <small className="text-muted">{paidByName} paid</small>
                      {(isUserOwed || userOwes) && (
                        <div
                          className={`small ${
                            isUserOwed ? "text-success" : "text-danger"
                          }`}
                        >
                          {isUserOwed ? "You are owed " : "You owe "}
                          {formatCurrency(userAmount)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </ListGroup.Item>
          );
        })
      ) : (
        <ListGroup.Item className="text-center py-4">
          <p className="mb-0 text-muted">No expenses found</p>
        </ListGroup.Item>
      )}
    </ListGroup>
  );
};

export default ExpenseList;
