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

const GroupDetail = ({ groupId }) => {
  const router = useRouter();
  const { currentUser } = useContext(AuthContext);
  const {
    groups,
    deleteGroup,
    getExpensesByGroup,
    getFriendById,
    calculateBalances,
  } = useContext(ExpenseContext);

  const [activeTab, setActiveTab] = useState("expenses");

  // Find the group by ID
  const group = groups.find((g) => g.id === groupId);

  if (!group) {
    return (
      <Card className="text-center p-5">
        <p className="mb-0">Group not found</p>
        <Button
          variant="link"
          className="mt-3"
          onClick={() => router.push("/groups")}
        >
          Back to Groups
        </Button>
      </Card>
    );
  }

  // Get group expenses
  const expenses = getExpensesByGroup(groupId);

  // Calculate total group spending
  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Get formatted member names
  const getMembers = () => {
    if (!group.members || group.members.length === 0) {
      return ["You"];
    }

    return group.members.map((memberId) => {
      if (memberId === currentUser.id) {
        return "You";
      }
      const friend = getFriendById(memberId);
      return friend ? friend.name : "Unknown";
    });
  };

  // Calculate balances for this group
  const groupBalances = calculateBalances().filter((balance) => {
    // Only include balances where both users are in this group
    return (
      group.members.includes(balance.from) && group.members.includes(balance.to)
    );
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this group?")) {
      deleteGroup(group.id);
      router.push("/groups");
    }
  };

  return (
    <Card className="shadow-sm">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h4 className="mb-0">{group.name}</h4>
        <div>
          <Button
            variant="outline-primary"
            size="sm"
            className="me-2"
            onClick={() => router.push(`/groups/edit/${group.id}`)}
          >
            Edit Group
          </Button>
          <Button variant="outline-danger" size="sm" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Card.Header>

      <Card.Body>
        {group.description && (
          <p className="text-muted mb-4">{group.description}</p>
        )}

        <Row className="mb-4">
          <Col md={4}>
            <Card className="bg-light">
              <Card.Body className="text-center">
                <h6 className="text-muted mb-2">Total Group Spending</h6>
                <h3>{formatCurrency(totalSpent)}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="bg-light">
              <Card.Body className="text-center">
                <h6 className="text-muted mb-2">Members</h6>
                <h3>{group.members?.length || 1}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="bg-light">
              <Card.Body className="text-center">
                <h6 className="text-muted mb-2">Expenses</h6>
                <h3>{expenses.length}</h3>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
          <Nav variant="tabs" className="mb-4">
            <Nav.Item>
              <Nav.Link eventKey="expenses">Expenses</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="balances">Balances</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="members">Members</Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content>
            <Tab.Pane eventKey="expenses">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Group Expenses</h5>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() =>
                    router.push(`/expenses/new?groupId=${group.id}`)
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
                      No expenses yet in this group
                    </p>
                    <Button
                      variant="link"
                      onClick={() =>
                        router.push(`/expenses/new?groupId=${group.id}`)
                      }
                    >
                      Add the first expense
                    </Button>
                  </Card.Body>
                )}
              </Card>
            </Tab.Pane>

            <Tab.Pane eventKey="balances">
              <h5 className="mb-3">Group Balances</h5>

              <Card>
                <ListGroup variant="flush">
                  {groupBalances.length > 0 ? (
                    groupBalances.map((balance, index) => {
                      const fromIsCurrentUser = balance.from === currentUser.id;
                      const toIsCurrentUser = balance.to === currentUser.id;

                      let fromName = fromIsCurrentUser
                        ? "You"
                        : getFriendById(balance.from)?.name || "Unknown";

                      let toName = toIsCurrentUser
                        ? "You"
                        : getFriendById(balance.to)?.name || "Unknown";

                      return (
                        <ListGroup.Item
                          key={index}
                          className="d-flex justify-content-between align-items-center"
                        >
                          <div>
                            <strong>{fromName}</strong> owes{" "}
                            <strong>{toName}</strong>
                          </div>
                          <Badge bg="primary" pill>
                            {formatCurrency(balance.amount)}
                          </Badge>
                        </ListGroup.Item>
                      );
                    })
                  ) : (
                    <ListGroup.Item className="text-center py-4">
                      <p className="mb-0 text-muted">
                        No balances to settle in this group
                      </p>
                    </ListGroup.Item>
                  )}
                </ListGroup>
              </Card>
            </Tab.Pane>

            <Tab.Pane eventKey="members">
              <h5 className="mb-3">Group Members</h5>

              <Card>
                <ListGroup variant="flush">
                  {getMembers().map((name, index) => (
                    <ListGroup.Item
                      key={index}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <div>{name}</div>
                      {name === "You" && (
                        <Badge bg="success" pill>
                          You
                        </Badge>
                      )}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Card.Body>
    </Card>
  );
};

export default GroupDetail;
