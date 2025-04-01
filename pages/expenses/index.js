import React, { useContext, useState, useEffect } from "react";
import Head from "next/head";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  InputGroup,
} from "react-bootstrap";
import { useRouter } from "next/router";
import { ExpenseContext } from "../../src/contexts/ExpenseContext";
import ExpenseList from "../../src/components/expenses/ExpenseList";

const ExpensesPage = () => {
  const router = useRouter();
  const { expenses, groups } = useContext(ExpenseContext);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    groupId: "",
    sortBy: "date",
    sortOrder: "desc",
  });

  // Apply filters and sorting when expenses or filters change
  useEffect(() => {
    let result = [...expenses];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (expense) =>
          expense.description.toLowerCase().includes(searchLower) ||
          expense.notes?.toLowerCase().includes(searchLower)
      );
    }

    // Apply group filter
    if (filters.groupId) {
      result = result.filter((expense) => expense.groupId === filters.groupId);
    }

    // Apply sorting
    result.sort((a, b) => {
      let valueA, valueB;

      switch (filters.sortBy) {
        case "amount":
          valueA = a.amount;
          valueB = b.amount;
          break;
        case "description":
          valueA = a.description.toLowerCase();
          valueB = b.description.toLowerCase();
          break;
        case "date":
        default:
          valueA = new Date(a.date);
          valueB = new Date(b.date);
          break;
      }

      if (filters.sortOrder === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });

    setFilteredExpenses(result);
  }, [expenses, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <Head>
        <title>Expenses | Splitwise Clone</title>
      </Head>

      <Container className="py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Expenses</h1>
          <Button
            variant="primary"
            onClick={() => router.push("/expenses/new")}
          >
            Add Expense
          </Button>
        </div>

        <Row>
          <Col lg={3} className="mb-4">
            <Card className="shadow-sm">
              <Card.Header>
                <h5 className="mb-0">Filters</h5>
              </Card.Header>
              <Card.Body>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Search</Form.Label>
                    <Form.Control
                      type="text"
                      name="search"
                      value={filters.search}
                      onChange={handleFilterChange}
                      placeholder="Search expenses..."
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Group</Form.Label>
                    <Form.Select
                      name="groupId"
                      value={filters.groupId}
                      onChange={handleFilterChange}
                    >
                      <option value="">All Groups</option>
                      {groups.map((group) => (
                        <option key={group.id} value={group.id}>
                          {group.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Sort By</Form.Label>
                    <InputGroup>
                      <Form.Select
                        name="sortBy"
                        value={filters.sortBy}
                        onChange={handleFilterChange}
                      >
                        <option value="date">Date</option>
                        <option value="amount">Amount</option>
                        <option value="description">Description</option>
                      </Form.Select>
                      <Form.Select
                        name="sortOrder"
                        value={filters.sortOrder}
                        onChange={handleFilterChange}
                      >
                        <option value="desc">Descending</option>
                        <option value="asc">Ascending</option>
                      </Form.Select>
                    </InputGroup>
                  </Form.Group>

                  <Button
                    variant="secondary"
                    className="w-100"
                    onClick={() =>
                      setFilters({
                        search: "",
                        groupId: "",
                        sortBy: "date",
                        sortOrder: "desc",
                      })
                    }
                  >
                    Reset Filters
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={9}>
            <Card className="shadow-sm">
              <Card.Header>
                <h5 className="mb-0">
                  Expense List
                  <span className="text-muted ms-2">
                    ({filteredExpenses.length}{" "}
                    {filteredExpenses.length === 1 ? "expense" : "expenses"})
                  </span>
                </h5>
              </Card.Header>
              <ExpenseList expenses={filteredExpenses} />
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ExpensesPage;
