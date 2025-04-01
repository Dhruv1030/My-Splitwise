import React, { useContext } from "react";
import { Card, ListGroup, Badge } from "react-bootstrap";
import { useRouter } from "next/router";
import { ExpenseContext } from "../../contexts/ExpenseContext";

const GroupList = () => {
  const router = useRouter();
  const { groups, getExpensesByGroup, calculateGroupBalances } =
    useContext(ExpenseContext);

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <Card className="shadow-sm">
      <Card.Header>
        <h5 className="mb-0">Your Groups</h5>
      </Card.Header>

      <ListGroup variant="flush">
        {groups.length > 0 ? (
          groups.map((group) => {
            // Get expenses for this group
            const groupExpenses = getExpensesByGroup(group.id);
            const totalExpenses = groupExpenses.reduce(
              (sum, expense) => sum + expense.amount,
              0
            );

            // Get members count
            const membersCount = group.members?.length || 0;

            return (
              <ListGroup.Item
                key={group.id}
                action
                onClick={() => router.push(`/groups/${group.id}`)}
                className="d-flex justify-content-between align-items-center"
              >
                <div>
                  <h6 className="mb-1">{group.name}</h6>
                  <div className="text-muted small">
                    {membersCount} {membersCount === 1 ? "member" : "members"} •{" "}
                    {groupExpenses.length}{" "}
                    {groupExpenses.length === 1 ? "expense" : "expenses"}
                  </div>
                </div>
                <div className="text-end">
                  <div>{formatCurrency(totalExpenses)}</div>
                  <Badge bg="primary" className="rounded-pill">
                    {groupExpenses.length > 0 ? "Active" : "New"}
                  </Badge>
                </div>
              </ListGroup.Item>
            );
          })
        ) : (
          <ListGroup.Item className="text-center py-4">
            <p className="mb-0 text-muted">
              You haven't created any groups yet
            </p>
          </ListGroup.Item>
        )}
      </ListGroup>
    </Card>
  );
};

export default GroupList;
