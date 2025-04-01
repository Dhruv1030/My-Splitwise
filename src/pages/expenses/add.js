// pages/expenses/add.js
import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  InputGroup,
  Tabs,
  Tab,
} from "react-bootstrap";
import {
  BiReceipt,
  BiDollarSign,
  BiCalendar,
  BiImage,
  BiX,
  BiArrowBack,
  BiCheck,
} from "react-icons/bi";

export default function AddExpense() {
  const router = useRouter();

  // Mock data for groups and friends
  const [groups, setGroups] = useState([
    { id: 1, name: "Roommates" },
    { id: 2, name: "Trip to New York" },
    { id: 3, name: "Game Night" },
  ]);

  const [friends, setFriends] = useState([
    { id: 2, name: "Alex Thompson" },
    { id: 3, name: "Sarah Johnson" },
    { id: 4, name: "Mike Wilson" },
  ]);

  // Form state
  const [expense, setExpense] = useState({
    description: "",
    amount: "",
    date: new Date().toISOString().substr(0, 10),
    groupId: "",
    paidBy: 1, // Current user ID
    splitType: "equal",
    category: "general",
    notes: "",
    receipt: null,
    participants: [
      { id: 1, name: "You", included: true, customAmount: "" },
      ...friends.map((friend) => ({
        id: friend.id,
        name: friend.name,
        included: true,
        customAmount: "",
      })),
    ],
  });

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpense((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle paid by changes
  const handlePaidByChange = (e) => {
    const paidById = parseInt(e.target.value);
    setExpense((prev) => ({
      ...prev,
      paidBy: paidById,
    }));
  };

  // Toggle participant inclusion
  const toggleParticipant = (id) => {
    setExpense((prev) => ({
      ...prev,
      participants: prev.participants.map((p) =>
        p.id === id ? { ...p, included: !p.included } : p
      ),
    }));
  };

  // Handle custom amount changes
  const handleCustomAmountChange = (id, value) => {
    setExpense((prev) => ({
      ...prev,
      participants: prev.participants.map((p) =>
        p.id === id ? { ...p, customAmount: value } : p
      ),
    }));
  };

  // Calculate split amounts
  const calculateSplitAmounts = () => {
    const { amount, splitType, participants } = expense;
    const totalAmount = parseFloat(amount) || 0;
    const includedParticipants = participants.filter((p) => p.included);

    if (splitType === "equal") {
      const splitAmount = totalAmount / includedParticipants.length;
      return participants.map((p) => ({
        ...p,
        amount: p.included ? splitAmount.toFixed(2) : "0.00",
      }));
    } else if (splitType === "custom") {
      // Return participants with their custom amounts
      return participants.map((p) => ({
        ...p,
        amount: p.included ? p.customAmount || "0.00" : "0.00",
      }));
    }

    return participants;
  };

  // Calculate the sum of custom amounts
  const getCustomAmountSum = () => {
    return expense.participants
      .filter((p) => p.included)
      .reduce((sum, p) => sum + (parseFloat(p.customAmount) || 0), 0);
  };

  // Check if the custom amounts add up to the total
  const isCustomAmountValid = () => {
    if (expense.splitType !== "custom") return true;

    const total = parseFloat(expense.amount) || 0;
    const customSum = getCustomAmountSum();

    return Math.abs(total - customSum) < 0.01; // Allow for small rounding errors
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!expense.description.trim()) {
      alert("Please enter a description");
      return;
    }

    if (!expense.amount || parseFloat(expense.amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    if (expense.splitType === "custom" && !isCustomAmountValid()) {
      alert("The sum of custom amounts must equal the total expense amount");
      return;
    }

    // Process the expense
    const expenseData = {
      ...expense,
      amount: parseFloat(expense.amount),
      participants: calculateSplitAmounts(),
    };

    console.log("Submitting expense:", expenseData);

    // In a real app, you would save this to your backend
    // For now, we'll just redirect back to the dashboard
    router.push("/dashboard");
  };

  // Handle file input for receipt image
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setExpense((prev) => ({
        ...prev,
        receipt: file,
      }));
    }
  };

  // Clear the receipt image
  const clearReceipt = () => {
    setExpense((prev) => ({
      ...prev,
      receipt: null,
    }));
  };

  return (
    <>
      <Head>
        <title>Add Expense - Splitwise</title>
      </Head>

      <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
        <Container className="py-4">
          <div className="d-flex align-items-center mb-4">
            <Button
              variant="link"
              className="p-0 me-3 text-secondary"
              onClick={() => router.back()}
            >
              <BiArrowBack size={24} />
            </Button>
            <h1 className="mb-0">Add an expense</h1>
          </div>

          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={7}>
                    {/* Expense details */}
                    <div className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                            <BiReceipt />
                          </InputGroup.Text>
                          <Form.Control
                            type="text"
                            name="description"
                            placeholder="What was this expense for?"
                            value={expense.description}
                            onChange={handleChange}
                            required
                          />
                        </InputGroup>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Amount</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                            <BiDollarSign />
                          </InputGroup.Text>
                          <Form.Control
                            type="number"
                            name="amount"
                            placeholder="0.00"
                            step="0.01"
                            min="0.01"
                            value={expense.amount}
                            onChange={handleChange}
                            required
                          />
                        </InputGroup>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Date</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                            <BiCalendar />
                          </InputGroup.Text>
                          <Form.Control
                            type="date"
                            name="date"
                            value={expense.date}
                            onChange={handleChange}
                          />
                        </InputGroup>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Group</Form.Label>
                        <Form.Select
                          name="groupId"
                          value={expense.groupId}
                          onChange={handleChange}
                        >
                          <option value="">Select a group (optional)</option>
                          {groups.map((group) => (
                            <option key={group.id} value={group.id}>
                              {group.name}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Paid by</Form.Label>
                        <Form.Select
                          name="paidBy"
                          value={expense.paidBy}
                          onChange={handlePaidByChange}
                          required
                        >
                          <option value={1}>You</option>
                          {friends.map((friend) => (
                            <option key={friend.id} value={friend.id}>
                              {friend.name}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="mb-4">
                        <Form.Label>Category</Form.Label>
                        <Form.Select
                          name="category"
                          value={expense.category}
                          onChange={handleChange}
                        >
                          <option value="general">General</option>
                          <option value="food">Food & Drinks</option>
                          <option value="transportation">Transportation</option>
                          <option value="housing">Housing & Rent</option>
                          <option value="utilities">Utilities</option>
                          <option value="entertainment">Entertainment</option>
                          <option value="travel">Travel</option>
                          <option value="shopping">Shopping</option>
                          <option value="other">Other</option>
                        </Form.Select>
                      </Form.Group>

                      <div className="mb-3">
                        <Form.Label>Receipt (optional)</Form.Label>
                        {expense.receipt ? (
                          <div className="position-relative mb-3">
                            <img
                              src={URL.createObjectURL(expense.receipt)}
                              alt="Receipt"
                              className="img-thumbnail"
                              style={{ maxHeight: "200px" }}
                            />
                            <Button
                              variant="danger"
                              size="sm"
                              className="position-absolute top-0 end-0 m-1"
                              onClick={clearReceipt}
                            >
                              <BiX />
                            </Button>
                          </div>
                        ) : (
                          <div className="d-grid">
                            <Button
                              variant="outline-secondary"
                              className="position-relative"
                              onClick={() =>
                                document
                                  .getElementById("receipt-upload")
                                  .click()
                              }
                            >
                              <BiImage className="me-2" />
                              Add a receipt image
                              <Form.Control
                                id="receipt-upload"
                                type="file"
                                accept="image/*"
                                className="d-none"
                                onChange={handleFileChange}
                              />
                            </Button>
                          </div>
                        )}
                      </div>

                      <Form.Group className="mb-3">
                        <Form.Label>Notes (optional)</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="notes"
                          rows={3}
                          placeholder="Add notes or details about this expense"
                          value={expense.notes}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </div>
                  </Col>

                  <Col md={5}>
                    {/* Split details */}
                    <Card className="mb-4">
                      <Card.Header className="bg-light">
                        <h5 className="mb-0">Split Details</h5>
                      </Card.Header>
                      <Card.Body>
                        <Form.Group className="mb-3">
                          <Form.Label>Split Type</Form.Label>
                          <div>
                            <Form.Check
                              inline
                              type="radio"
                              id="split-equal"
                              label="Equal"
                              name="splitType"
                              value="equal"
                              checked={expense.splitType === "equal"}
                              onChange={handleChange}
                            />
                            <Form.Check
                              inline
                              type="radio"
                              id="split-custom"
                              label="Custom"
                              name="splitType"
                              value="custom"
                              checked={expense.splitType === "custom"}
                              onChange={handleChange}
                            />
                          </div>
                        </Form.Group>

                        <div className="mb-3">
                          <div className="fw-bold mb-2">
                            Select Participants
                          </div>
                          <div className="border rounded">
                            {expense.participants.map((participant) => (
                              <div
                                key={participant.id}
                                className="d-flex align-items-center p-2 border-bottom"
                              >
                                <Form.Check
                                  type="checkbox"
                                  checked={participant.included}
                                  onChange={() =>
                                    toggleParticipant(participant.id)
                                  }
                                  label={participant.name}
                                  className="me-auto"
                                />

                                {expense.splitType === "custom" &&
                                  participant.included && (
                                    <Form.Control
                                      type="number"
                                      placeholder="0.00"
                                      step="0.01"
                                      min="0"
                                      value={participant.customAmount}
                                      onChange={(e) =>
                                        handleCustomAmountChange(
                                          participant.id,
                                          e.target.value
                                        )
                                      }
                                      style={{ width: "100px" }}
                                    />
                                  )}

                                {expense.splitType === "equal" &&
                                  participant.included && (
                                    <div className="text-muted">
                                      $
                                      {expense.amount
                                        ? (
                                            parseFloat(expense.amount) /
                                            expense.participants.filter(
                                              (p) => p.included
                                            ).length
                                          ).toFixed(2)
                                        : "0.00"}
                                    </div>
                                  )}
                              </div>
                            ))}
                          </div>

                          {expense.splitType === "custom" && (
                            <div className="d-flex justify-content-between mt-2">
                              <span>Total:</span>
                              <span
                                className={
                                  isCustomAmountValid()
                                    ? "text-success"
                                    : "text-danger"
                                }
                              >
                                ${getCustomAmountSum().toFixed(2)} / $
                                {expense.amount || "0.00"}
                              </span>
                            </div>
                          )}
                        </div>
                      </Card.Body>
                    </Card>

                    <div className="d-grid gap-2">
                      <Button type="submit" variant="primary" size="lg">
                        <BiCheck className="me-2" /> Save Expense
                      </Button>
                      <Button
                        variant="outline-secondary"
                        onClick={() => router.back()}
                      >
                        Cancel
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </>
  );
}
