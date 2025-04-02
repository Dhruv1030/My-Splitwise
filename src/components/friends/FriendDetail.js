import React, { useContext, useState } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Nav,
  Tab,
  ListGroup,
  Badge,
} from "react-bootstrap";
import { useRouter } from "next/router";
import { AuthContext } from "../../contexts/AuthContext";
import { ExpenseContext } from "../../contexts/ExpenseContext";
import ExpenseList from "../expenses/ExpenseList";

const FriendDetail = ({ friendId }) => {
  const router = useRouter();
  const { currentUser } = useContext(AuthContext);
  const { friends, deleteFriend, getExpensesByFriend, calculateBalances } =
    useContext(ExpenseContext);

  const [activeTab, setActiveTab] = useState("expenses");

  // Find the friend by ID
  const friend = friends.find((f) => f.id === friendId);

  if (!friend) {
    return (
      <Card className="text-center p-5">
        <p className="mb-0">Friend not found</p>
        <Button
          variant="link"
          className="mt-3"
          onClick={() => router.push("/friends")}
        >
          Back to Friends
        </Button>
      </Card>
    );
  }

  // Get expenses with this friend
  const expenses = getExpensesByFriend(friendId);

  // Get balance with this friend
  const balanceWithFriend = calculateBalances().find(
    (balance) =>
      (balance.from === currentUser?.id && balance.to === friendId) ||
      (balance.to === currentUser?.id && balance.from === friendId)
  );

  const hasBalance =
    balanceWithFriend && parseFloat(balanceWithFriend.amount) > 0;
  const youOwe = balanceWithFriend?.from === currentUser?.id;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handleDeleteFriend = () => {
    if (
      window.confirm(
        `Are you sure you want to remove ${friend.name} from your friends?`
      )
    ) {
      deleteFriend(friend.id);
      router.push("/friends");
    }
  };

  return (
    <Card className="shadow-sm">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <div
            className="rounded-circle bg-secondary d-flex align-items-center justify-content-center me-3"
            style={{
              width: 48,
              height: 48,
              color: "white",
              fontSize: "1.5rem",
            }}
          >
            {friend.name.charAt(0).toUpperCase()}
          </div>
          <h4 className="mb-0">{friend.name}</h4>
        </div>
        <div>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={handleDeleteFriend}
          >
            Remove Friend
          </Button>
        </div>
      </Card.Header>

      <Card.Body>
        <Row className="mb-4">
          <Col md={6}>
            <p className="mb-1">
              <strong>Email:</strong> {friend.email}
            </p>
            {friend.phone && (
              <p className="mb-0">
                <strong>Phone:</strong> {friend.phone}
              </p>
            )}
          </Col>
          <Col md={6} className="text-md-end">
            {hasBalance ? (
              <div>
                <h5 className={youOwe ? "text-danger" : "text-success"}>
                  {youOwe ? "You owe " : "Owes you "}
                  {formatCurrency(balanceWithFriend.amount)}
                </h5>
                <Button
                  variant={youOwe ? "danger" : "success"}
                  size="sm"
                  onClick={() =>
                    router.push(`/settlements/new?friendId=${friend.id}`)
                  }
                >
                  {youOwe
                    ? "Pay " + friend.name
                    : "Record payment from " + friend.name}
                </Button>
              </div>
            ) : (
              <p className="text-muted mb-0">You're all settled up</p>
            )}
          </Col>
        </Row>

        <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
          <Nav variant="tabs" className="mb-4">
            <Nav.Item>
              <Nav.Link eventKey="expenses">Expenses</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="activities">Activities</Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content>
            <Tab.Pane eventKey="expenses">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Expenses with {friend.name}</h5>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() =>
                    router.push(`/expenses/new?friendId=${friend.id}`)
                  }
                >
                  Add Expense
                </Button>
              </div>

              <Card>
                {expenses.length > 0 ? (
                  <ExpenseList expenses={expenses} />
                ) : (
                  <Card.Body className="text-center py-4">
                    <p className="mb-0 text-muted">
                      No expenses yet with {friend.name}
                    </p>
                    <Button
                      variant="link"
                      onClick={() =>
                        router.push(`/expenses/new?friendId=${friend.id}`)
                      }
                    >
                      Add the first expense
                    </Button>
                  </Card.Body>
                )}
              </Card>
            </Tab.Pane>

            <Tab.Pane eventKey="activities">
              <h5 className="mb-3">Recent Activities</h5>

              {expenses.length > 0 ? (
                <ListGroup className="mb-3">
                  {expenses.slice(0, 5).map((expense) => {
                    const date = new Date(expense.date);
                    return (
                      <ListGroup.Item key={expense.id}>
                        <div className="d-flex justify-content-between">
                          <div>
                            <strong>
                              {expense.paidBy === currentUser?.id
                                ? "You"
                                : friend.name}
                              {" paid "}
                              {formatCurrency(expense.amount)}
                            </strong>
                            <div className="text-muted small">
                              {expense.description}
                            </div>
                          </div>
                          <div className="text-muted small">
                            {date.toLocaleDateString()}
                          </div>
                        </div>
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              ) : (
                <Card className="text-center py-4">
                  <p className="mb-0 text-muted">
                    No activities yet with {friend.name}
                  </p>
                </Card>
              )}
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Card.Body>

      <Card.Footer>
        <div className="d-flex justify-content-between">
          <Button variant="secondary" onClick={() => router.back()}>
            Back
          </Button>

          <Button
            variant="primary"
            onClick={() => router.push(`/expenses/new?friendId=${friend.id}`)}
          >
            Add Expense with {friend.name}
          </Button>
        </div>
      </Card.Footer>
    </Card>
  );
};

export default FriendDetail;
