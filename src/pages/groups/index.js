// pages/groups/index.js
import { useState, useEffect } from "react";
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
import { BiGroup, BiPlus, BiUser, BiDollarSign } from "react-icons/bi";

export default function Groups() {
  const router = useRouter();

  // Mock data
  const [groups, setGroups] = useState([
    {
      id: 1,
      name: "Roommates",
      members: 3,
      totalExpenses: 750.25,
      owedToYou: 175.5,
      youOwe: 100.25,
      color: "primary",
      createdAt: "2023-06-15T10:30:00Z",
      expenses: 8,
    },
    {
      id: 2,
      name: "Trip to New York",
      members: 4,
      totalExpenses: 1250.75,
      owedToYou: 75.25,
      youOwe: 85.25,
      color: "success",
      createdAt: "2023-07-01T14:45:00Z",
      expenses: 12,
    },
    {
      id: 3,
      name: "Game Night",
      members: 5,
      totalExpenses: 125.0,
      owedToYou: 0,
      youOwe: 0,
      color: "warning",
      createdAt: "2023-07-20T19:15:00Z",
      expenses: 3,
    },
  ]);

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
    <>
      <Head>
        <title>Your Groups - Splitwise</title>
      </Head>

      <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
        <Container className="py-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Your Groups</h1>
            <Button
              variant="primary"
              onClick={() => router.push("/groups/create")}
            >
              <BiPlus className="me-2" /> Create a group
            </Button>
          </div>

          {groups.length === 0 ? (
            <Card className="text-center p-5">
              <Card.Body>
                <BiGroup size={48} className="text-muted mb-3" />
                <h4>No groups yet</h4>
                <p className="text-muted">
                  Groups help you organize expenses with specific people.
                </p>
                <Button
                  variant="primary"
                  onClick={() => router.push("/groups/create")}
                >
                  <BiPlus className="me-2" /> Create a group
                </Button>
              </Card.Body>
            </Card>
          ) : (
            <Row>
              {groups.map((group) => (
                <Col md={6} lg={4} key={group.id} className="mb-4">
                  <Card className="h-100">
                    <Card.Body>
                      <div
                        className={`d-flex align-items-center justify-content-center bg-${group.color} text-white rounded mb-3`}
                        style={{ height: "80px" }}
                      >
                        <h2>{group.name.charAt(0).toUpperCase()}</h2>
                      </div>
                      <Card.Title className="mb-3">{group.name}</Card.Title>
                      <div className="d-flex justify-content-between mb-2">
                        <div className="text-muted">Members</div>
                        <div>{group.members}</div>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <div className="text-muted">Expenses</div>
                        <div>{group.expenses}</div>
                      </div>
                      <div className="d-flex justify-content-between mb-3">
                        <div className="text-muted">Created</div>
                        <div>{formatDate(group.createdAt)}</div>
                      </div>

                      <hr />

                      <div className="d-flex justify-content-between mb-3">
                        <div>
                          {group.youOwe > 0 && (
                            <div className="text-danger">
                              You owe {formatCurrency(group.youOwe)}
                            </div>
                          )}
                          {group.owedToYou > 0 && (
                            <div className="text-success">
                              Owed to you {formatCurrency(group.owedToYou)}
                            </div>
                          )}
                          {group.youOwe === 0 && group.owedToYou === 0 && (
                            <div className="text-muted">All settled up</div>
                          )}
                        </div>
                      </div>

                      <div className="d-grid gap-2">
                        <Button
                          variant="outline-primary"
                          onClick={() => router.push(`/groups/${group.id}`)}
                        >
                          View Details
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </div>
    </>
  );
}
