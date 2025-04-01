import React, { useState, useContext, useEffect } from "react";
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import { useRouter } from "next/router";
import { AuthContext } from "../../contexts/AuthContext";
import { ExpenseContext } from "../../contexts/ExpenseContext";

const AddExpenseForm = () => {
  const router = useRouter();
  const { currentUser } = useContext(AuthContext);
  const { addExpense, friends, groups } = useContext(ExpenseContext);

  const [expenseData, setExpenseData] = useState({
    description: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    paidBy: currentUser?.id || "",
    splitType: "equal",
    groupId: "",
    participants: [],
    notes: "",
  });

  const [selectedParticipants, setSelectedParticipants] = useState([]);

  // Initialize participants with current user
  useEffect(() => {
    if (currentUser) {
      setSelectedParticipants([currentUser.id]);
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpenseData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // If group is selected, update participants
    if (name === "groupId" && value) {
      const selectedGroup = groups.find((group) => group.id === value);
      if (selectedGroup && selectedGroup.members) {
        setSelectedParticipants(
          selectedGroup.members.map((member) => member.id)
        );
      }
    }
  };

  const handleParticipantToggle = (participantId) => {
    setSelectedParticipants((prev) => {
      if (prev.includes(participantId)) {
        return prev.filter((id) => id !== participantId);
      } else {
        return [...prev, participantId];
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Process participants based on split type
    const participants = selectedParticipants.map((id) => {
      return {
        id,
        amount:
          expenseData.splitType === "equal"
            ? parseFloat(expenseData.amount) / selectedParticipants.length
            : 0, // This would be updated for custom splits
      };
    });

    // Create the expense object
    const newExpense = {
      ...expenseData,
      amount: parseFloat(expenseData.amount),
      participants,
      createdBy: currentUser.id,
      timestamp: new Date().toISOString(),
    };

    // Add the expense
    addExpense(newExpense);

    // Redirect to expenses page or dashboard
    router.push("/dashboard");
  };

  return (
    <Card className="shadow-sm">
      <Card.Header as="h5">Add New Expense</Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              name="description"
              value={expenseData.description}
              onChange={handleChange}
              placeholder="What was this expense for?"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="number"
              name="amount"
              value={expenseData.amount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0.01"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              name="date"
              value={expenseData.date}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Paid By</Form.Label>
            <Form.Select
              name="paidBy"
              value={expenseData.paidBy}
              onChange={handleChange}
              required
            >
              <option value={currentUser?.id}>You</option>
              {friends.map((friend) => (
                <option key={friend.id} value={friend.id}>
                  {friend.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Group (Optional)</Form.Label>
            <Form.Select
              name="groupId"
              value={expenseData.groupId}
              onChange={handleChange}
            >
              <option value="">No Group</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Split Type</Form.Label>
            <Form.Select
              name="splitType"
              value={expenseData.splitType}
              onChange={handleChange}
              required
            >
              <option value="equal">Split Equally</option>
              <option value="custom">Custom Split</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Participants</Form.Label>
            <div className="border rounded p-3">
              <Form.Check
                type="checkbox"
                id={`participant-you`}
                label="You"
                checked={selectedParticipants.includes(currentUser?.id)}
                onChange={() => handleParticipantToggle(currentUser?.id)}
                className="mb-2"
              />

              {friends.map((friend) => (
                <Form.Check
                  key={friend.id}
                  type="checkbox"
                  id={`participant-${friend.id}`}
                  label={friend.name}
                  checked={selectedParticipants.includes(friend.id)}
                  onChange={() => handleParticipantToggle(friend.id)}
                  className="mb-2"
                />
              ))}
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Notes (Optional)</Form.Label>
            <Form.Control
              as="textarea"
              name="notes"
              rows={3}
              value={expenseData.notes}
              onChange={handleChange}
              placeholder="Add any additional details..."
            />
          </Form.Group>

          <div className="d-flex justify-content-end">
            <Button
              variant="secondary"
              className="me-2"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Expense
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default AddExpenseForm;
