import { useContext, useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Tab,
  Nav,
  ListGroup,
  Badge,
} from "react-bootstrap";
import {
  BiPlus,
  BiDollar,
  BiUser,
  BiGroup,
  BiReceipt,
  BiCreditCard,
  BiBell,
} from "react-icons/bi";
import ExpenseContext from "../src/contexts/ExpenseContext";
import { AuthContext } from "../src/contexts/AuthContext";

const Dashboard = () => {
  const router = useRouter();
  const { currentUser } = useContext(AuthContext);
  const {
    expenses,
    groups,
    friends,
    loading,
    getNetBalance,
    getTotalOwedToUser,
    getTotalUserOwes,
    calculateBalances,
    getFriendById,
    getGroupById,
  } = useContext(ExpenseContext);

  const [recentExpenses, setRecentExpenses] = useState([]);
  const [balances, setBalances] = useState([]);

  useEffect(() => {
    if (!loading) {
      // Get recent expenses (sorted by date)
      const sorted = [...expenses]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
      setRecentExpenses(sorted);

      // Calculate balances
      setBalances(calculateBalances());
    }
  }, [expenses, loading, calculateBalances]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const netBalance = getNetBalance();
  const totalOwedToUser = getTotalOwedToUser();
  const totalUserOwes = getTotalUserOwes();

  return (
    <>
      <Head>
        <title>Dashboard | Splitwise Clone</title>
      </Head>

      <Container className="py-4">
        <Row className="mb-4">
          <Col>
            <h1 className="mb-4">Dashboard</h1>

            <Row>
              <Col md={4}>
                <Card className="mb-3">
                  <Card.Body>
                    <h5 className="text-muted mb-2">Total Balance</h5>
                    <h3
                      className={
                        parseFloat(netBalance) >= 0
                          ? "text-success"
                          : "text-danger"
                      }
                    >
                      {formatCurrency(netBalance)}
                    </h3>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4}>
                <Card className="mb-3">
                  <Card.Body>
                    <h5 className="text-muted mb-2">You owe</h5>
                    <h3 className="text-danger">
                      {formatCurrency(totalUserOwes)}
                    </h3>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4}>
                <Card className="mb-3">
                  <Card.Body>
                    <h5 className="text-muted mb-2">You are owed</h5>
                    <h3 className="text-success">
                      {formatCurrency(totalOwedToUser)}
                    </h3>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>

        <Row>
          <Col lg={8}>
            <Card className="mb-4">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Recent Activity</h5>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => router.push("/expenses/new")}
                >
                  <BiPlus className="me-1" /> Add Expense
                </Button>
              </Card.Header>

              <ListGroup variant="flush">
                {recentExpenses.length > 0 ? (
                  recentExpenses.map((expense) => (
                    <ListGroup.Item key={expense.id} className="px-4 py-3">
                      <div className="d-flex align-items-center">
                        <div className="me-3">
                          {expense.isPayment ? (
                            <div
                              className="bg-success rounded-circle d-flex align-items-center justify-content-center"
                              style={{ width: 40, height: 40 }}
                            >
                              <BiCreditCard color="white" size={24} />
                            </div>
                          ) : (
                            <div
                              className="bg-primary rounded-circle d-flex align-items-center justify-content-center"
                              style={{ width: 40, height: 40 }}
                            >
                              <BiReceipt color="white" size={24} />
                            </div>
                          )}
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between">
                            <div>
                              <h6 className="mb-0">{expense.description}</h6>
                              <small className="text-muted">
                                {new Date(expense.date).toLocaleDateString()}
                                {expense.groupId && (
                                  <>
                                    {" • "}
                                    <Badge bg="light" text="dark">
                                      {getGroupById(expense.groupId)?.name}
                                    </Badge>
                                  </>
                                )}
                              </small>
                            </div>
                            <div className="text-end">
                              <h6 className="mb-0">
                                {formatCurrency(expense.amount)}
                              </h6>
                              <small className="text-muted">
                                {expense.paidBy === currentUser.id
                                  ? "You paid"
                                  : `${
                                      getFriendById(expense.paidBy)?.name
                                    } paid`}
                              </small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))
                ) : (
                  <ListGroup.Item className="text-center py-4">
                    <p className="mb-0 text-muted">No recent expenses</p>
                    <Button
                      variant="link"
                      onClick={() => router.push("/expenses/new")}
                    >
                      Add your first expense
                    </Button>
                  </ListGroup.Item>
                )}
              </ListGroup>

              {recentExpenses.length > 0 && (
                <Card.Footer className="text-center">
                  <Button
                    variant="link"
                    onClick={() => router.push("/expenses")}
                  >
                    View all expenses
                  </Button>
                </Card.Footer>
              )}
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="mb-4">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Balances</h5>
                <Button
                  variant="outline-success"
                  size="sm"
                  onClick={() => router.push("/settlements/new")}
                >
                  <BiDollar className="me-1" /> Settle Up
                </Button>
              </Card.Header>

              <ListGroup variant="flush">
                {balances.length > 0 ? (
                  balances.map((balance, index) => {
                    const isCurrentUserOwing = balance.from === currentUser.id;
                    const otherPersonId = isCurrentUserOwing
                      ? balance.to
                      : balance.from;
                    const otherPerson = getFriendById(otherPersonId);

                    return (
                      <ListGroup.Item key={index} className="px-4 py-3">
                        <div className="d-flex align-items-center">
                          <div className="me-3">
                            <div
                              className={`bg-${
                                isCurrentUserOwing ? "danger" : "success"
                              } rounded-circle d-flex align-items-center justify-content-center`}
                              style={{ width: 40, height: 40 }}
                            >
                              <BiUser color="white" size={24} />
                            </div>
                          </div>
                          <div className="flex-grow-1">
                            <div className="d-flex justify-content-between">
                              <div>
                                <h6 className="mb-0">{otherPerson?.name}</h6>
                                <small
                                  className={`text-${
                                    isCurrentUserOwing ? "danger" : "success"
                                  }`}
                                >
                                  {isCurrentUserOwing ? "You owe" : "Owes you"}
                                </small>
                              </div>
                              <div className="text-end">
                                <h6
                                  className={`mb-0 text-${
                                    isCurrentUserOwing ? "danger" : "success"
                                  }`}
                                >
                                  {formatCurrency(balance.amount)}
                                </h6>
                              </div>
                            </div>
                          </div>
                        </div>
                      </ListGroup.Item>
                    );
                  })
                ) : (
                  <ListGroup.Item className="text-center py-4">
                    <p className="text-muted mb-0">No balances to settle</p>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card>

            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Groups</h5>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => router.push("/groups/new")}
                >
                  <BiPlus className="me-1" /> New Group
                </Button>
              </Card.Header>

              <ListGroup variant="flush">
                {groups.length > 0 ? (
                  groups.slice(0, 3).map((group) => (
                    <ListGroup.Item
                      key={group.id}
                      action
                      onClick={() => router.push(`/groups/${group.id}`)}
                    >
                      <div className="d-flex align-items-center">
                        <div className="me-3">
                          <div
                            className="bg-secondary rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: 40, height: 40 }}
                          >
                            <BiGroup color="white" size={24} />
                          </div>
                        </div>
                        <div>
                          <h6 className="mb-0">{group.name}</h6>
                          <small className="text-muted">
                            {group.members?.length || 0} members
                          </small>
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))
                ) : (
                  <ListGroup.Item className="text-center py-4">
                    <p className="text-muted mb-0">No groups yet</p>
                    <Button
                      variant="link"
                      onClick={() => router.push("/groups/new")}
                    >
                      Create your first group
                    </Button>
                  </ListGroup.Item>
                )}
              </ListGroup>

              {groups.length > 0 && (
                <Card.Footer className="text-center">
                  <Button variant="link" onClick={() => router.push("/groups")}>
                    View all groups
                  </Button>
                </Card.Footer>
              )}
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Dashboard;
