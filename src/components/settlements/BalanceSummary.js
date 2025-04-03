import React, { useContext } from "react";
import { Card, ListGroup, Badge, Button } from "react-bootstrap";
import { useRouter } from "next/router";
import { AuthContext } from "../../contexts/AuthContext";
import { ExpenseContext } from "../../contexts/ExpenseContext";

const BalanceSummary = () => {
  const router = useRouter();
  const { currentUser } = useContext(AuthContext);
  const {
    calculateBalances,
    getFriendById,
    getTotalOwedToUser,
    getTotalUserOwes,
  } = useContext(ExpenseContext);

  // Get all balances
  const balances = calculateBalances();

  // Filter balances involving the current user
  const userBalances = balances.filter(
    (balance) =>
      balance.from === currentUser?.id || balance.to === currentUser?.id
  );

  // Format currency for display
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Get totals
  const totalOwed = getTotalOwedToUser();
  const totalOwes = getTotalUserOwes();
  const netBalance = parseFloat(totalOwed) - parseFloat(totalOwes);

  return (
    <Card className="shadow-sm">
      <Card.Header>
        <h5 className="mb-0">Balance Summary</h5>
      </Card.Header>

      <Card.Body className="p-0">
        <div className="d-flex border-bottom">
          <div className="flex-fill p-3 text-center border-end">
            <div className="text-muted mb-1">You owe</div>
            <h5 className="text-danger mb-0">{formatCurrency(totalOwes)}</h5>
          </div>
          <div className="flex-fill p-3 text-center">
            <div className="text-muted mb-1">You are owed</div>
            <h5 className="text-success mb-0">{formatCurrency(totalOwed)}</h5>
          </div>
        </div>

        <div className="p-3 text-center border-bottom">
          <div className="text-muted mb-1">Net Balance</div>
          <h4
            className={
              netBalance >= 0 ? "text-success mb-0" : "text-danger mb-0"
            }
          >
            {formatCurrency(Math.abs(netBalance))}
            {netBalance >= 0 ? " in your favor" : " you owe"}
          </h4>
        </div>
      </Card.Body>

      <ListGroup variant="flush">
        {userBalances.length > 0 ? (
          userBalances.map((balance, index) => {
            const isUserOwing = balance.from === currentUser?.id;
            const otherPersonId = isUserOwing ? balance.to : balance.from;
            const otherPerson = getFriendById(otherPersonId);

            return (
              <ListGroup.Item
                key={index}
                className="d-flex justify-content-between align-items-center px-4 py-3"
              >
                <div className="d-flex align-items-center">
                  <div
                    className={`rounded-circle bg-${
                      isUserOwing ? "danger" : "success"
                    } d-flex align-items-center justify-content-center me-3`}
                    style={{ width: 40, height: 40, color: "white" }}
                  >
                    {otherPerson?.name.charAt(0).toUpperCase() || "?"}
                  </div>
                  <div>
                    <h6 className="mb-0">{otherPerson?.name || "Unknown"}</h6>
                    <small
                      className={`text-${isUserOwing ? "danger" : "success"}`}
                    >
                      {isUserOwing ? "You owe" : "Owes you"}{" "}
                      {formatCurrency(balance.amount)}
                    </small>
                  </div>
                </div>

                <Button
                  variant={isUserOwing ? "outline-danger" : "outline-success"}
                  size="sm"
                  onClick={() =>
                    router.push(`/settlements/new?friendId=${otherPersonId}`)
                  }
                >
                  {isUserOwing ? "Pay" : "Settle Up"}
                </Button>
              </ListGroup.Item>
            );
          })
        ) : (
          <ListGroup.Item className="text-center py-4">
            <p className="mb-0 text-muted">You're all settled up!</p>
            <p className="small text-muted">
              Add expenses to track balances with friends
            </p>
          </ListGroup.Item>
        )}
      </ListGroup>
    </Card>
  );
};

export default BalanceSummary;
