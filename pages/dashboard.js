import { useContext, useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  ListGroup,
  Badge,
} from "react-bootstrap";
import { AuthContext } from "../src/contexts/AuthContext";
import { ExpenseContext } from "../src/contexts/ExpenseContext";
import ExpenseChart from "../src/components/analytics/ExpenseChart";
import ActivityFeed from "../src/components/dashboard/ActivityFeed";

const Dashboard = () => {
  const router = useRouter();
  const { currentUser, loading: authLoading } = useContext(AuthContext);
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
  const [totals, setTotals] = useState({
    netBalance: "0.00",
    totalOwed: "0.00",
    totalOwes: "0.00",
  });

  // Protect the route: if auth is done loading and there's no user, redirect to login
  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.push("/login");
    }
  }, [authLoading, currentUser, router]);

  // Update dashboard data when expenses change
  useEffect(() => {
    if (!loading) {
      // Get recent expenses (sorted by date)
      const sorted = [...expenses]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
      setRecentExpenses(sorted);

      // Calculate balances
      const calculatedBalances = calculateBalances();
      setBalances(calculatedBalances);

      // Update totals
      const netBalance = getNetBalance();
      const totalOwed = getTotalOwedToUser();
      const totalOwes = getTotalUserOwes();

      setTotals({
        netBalance,
        totalOwed,
        totalOwes,
      });
    }
  }, [
    expenses,
    loading,
    calculateBalances,
    getNetBalance,
    getTotalOwedToUser,
    getTotalUserOwes,
  ]);

  console.log("currentUser:", currentUser);
  console.log("authLoading:", authLoading);
  console.log("expenses loading:", loading);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Show loading indicator if either auth or expense data is still loading
  // if (loading || authLoading) {
  //   return (
  //     <div className="d-flex justify-content-center align-items-center vh-100">
  //       <div className="spinner-border text-primary" role="status">
  //         <span className="visually-hidden">Loading...</span>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <>
      <Head>
        <title>Dashboard | Splitwise Clone</title>
        <Button
          variant="outline-success"
          className="mb-3"
          onClick={async () => {
            const { addExpense } = useContext(ExpenseContext);
            await addExpense({
              description: "🧪 Test expense via button",
              amount: 42,
              paidBy: currentUser?.id,
              participants: [{ id: currentUser?.id, amount: 42 }],
              groupId: "group1",
              date: new Date().toISOString(),
            });
            console.log("✅ Test expense added");
          }}
        >
          Add Test Expense
        </Button>
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
                        parseFloat(totals.netBalance) >= 0
                          ? "text-success"
                          : "text-danger"
                      }
                    >
                      {formatCurrency(totals.netBalance)}
                    </h3>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="mb-3">
                  <Card.Body>
                    <h5 className="text-muted mb-2">You owe</h5>
                    <h3 className="text-danger">
                      {formatCurrency(totals.totalOwes)}
                    </h3>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="mb-3">
                  <Card.Body>
                    <h5 className="text-muted mb-2">You are owed</h5>
                    <h3 className="text-success">
                      {formatCurrency(totals.totalOwed)}
                    </h3>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>

        {expenses.length > 0 && (
          <Row className="mb-4">
            <Col>
              <ExpenseChart />
              <div className="text-center">
                <Button
                  variant="link"
                  onClick={() => router.push("/analytics")}
                >
                  View detailed analytics
                </Button>
              </div>
            </Col>
          </Row>
        )}

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
                  Add Expense
                </Button>
              </Card.Header>
              <ListGroup variant="flush">
                {recentExpenses.length > 0 ? (
                  recentExpenses.map((expense) => (
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
                                {new Date(expense.date).toLocaleDateString()}
                                {expense.groupId && (
                                  <>
                                    {" • "}
                                    <Badge bg="light" text="dark">
                                      {getGroupById(expense.groupId)?.name ||
                                        "Group"}
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
                                {expense.paidBy === currentUser?.id
                                  ? "You paid"
                                  : `${
                                      getFriendById(expense.paidBy)?.name ||
                                      "Someone"
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
                  disabled={balances.length === 0}
                >
                  Settle Up
                </Button>
              </Card.Header>
              <ListGroup variant="flush">
                {balances.length > 0 ? (
                  balances.map((balance, index) => {
                    const isCurrentUserOwing = balance.from === currentUser?.id;
                    const otherPersonId = isCurrentUserOwing
                      ? balance.to
                      : balance.from;
                    const otherPerson = getFriendById(otherPersonId);

                    return (
                      <ListGroup.Item
                        key={index}
                        className="px-4 py-3"
                        action
                        onClick={() =>
                          router.push(
                            `/settlements/new?friendId=${otherPersonId}`
                          )
                        }
                      >
                        <div className="d-flex align-items-center">
                          <div className="me-3">
                            <div
                              className={`bg-${
                                isCurrentUserOwing ? "danger" : "success"
                              } rounded-circle d-flex align-items-center justify-content-center`}
                              style={{ width: 40, height: 40, color: "white" }}
                            >
                              {otherPerson?.name?.charAt(0).toUpperCase() ||
                                "U"}
                            </div>
                          </div>
                          <div className="flex-grow-1">
                            <div className="d-flex justify-content-between">
                              <div>
                                <h6 className="mb-0">
                                  {otherPerson?.name || "Unknown"}
                                </h6>
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
                  New Group
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
                            style={{ width: 40, height: 40, color: "white" }}
                          >
                            G
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
        <Row>
          <Col>
            <h5 className="mt-5 mb-3 text-muted">Full Activity Feed</h5>
            <ActivityFeed />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Dashboard;
