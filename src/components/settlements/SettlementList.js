import React, { useContext } from "react";
import { Card, ListGroup, Badge } from "react-bootstrap";
import { useRouter } from "next/router";
import { AuthContext } from "../../contexts/AuthContext";
import { ExpenseContext } from "../../contexts/ExpenseContext";

const SettlementList = () => {
  const router = useRouter();
  const { currentUser } = useContext(AuthContext);
  const { expenses, getFriendById } = useContext(ExpenseContext);

  // Filter expenses to only show settlements/payments
  const settlements = expenses.filter((expense) => expense.isPayment);

  // Sort by date (newest first)
  const sortedSettlements = [...settlements].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

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
    <Card className="shadow-sm">
      <Card.Header>
        <h5 className="mb-0">Recent Settlements</h5>
      </Card.Header>

      <ListGroup variant="flush">
        {sortedSettlements.length > 0 ? (
          sortedSettlements.map((settlement) => {
            const paidBy = settlement.paidBy;
            const paidTo = settlement.participants.find(
              (p) => p.id !== paidBy
            )?.id;

            const isPayer = paidBy === currentUser?.id;
            const isReceiver = paidTo === currentUser?.id;

            const otherPersonId = isPayer ? paidTo : paidBy;
            const otherPerson = getFriendById(otherPersonId);

            return (
              <ListGroup.Item
                key={settlement.id}
                action
                onClick={() => router.push(`/expenses/${settlement.id}`)}
                className="px-4 py-3"
              >
                <div className="d-flex align-items-center">
                  <div className="me-3">
                    <div
                      className="bg-success rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: 40, height: 40, color: "white" }}
                    >
                      P
                    </div>
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h6 className="mb-0">
                          {isPayer ? "You paid " : `${otherPerson?.name} paid `}
                          {isReceiver ? "you" : otherPerson?.name}
                        </h6>
                        <small className="text-muted">
                          {formatDate(settlement.date)}
                          {settlement.notes && (
                            <span className="ms-2">• {settlement.notes}</span>
                          )}
                        </small>
                      </div>
                      <div className="text-end">
                        <h6
                          className={`mb-0 ${
                            isPayer ? "text-danger" : "text-success"
                          }`}
                        >
                          {formatCurrency(settlement.amount)}
                        </h6>
                        <Badge bg={isPayer ? "danger" : "success"}>
                          {isPayer ? "Paid" : "Received"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </ListGroup.Item>
            );
          })
        ) : (
          <ListGroup.Item className="text-center py-4">
            <p className="mb-0 text-muted">No settlements recorded yet</p>
            <p className="small text-muted">
              Record payments when friends settle their debts with you
            </p>
          </ListGroup.Item>
        )}
      </ListGroup>
    </Card>
  );
};

export default SettlementList;
