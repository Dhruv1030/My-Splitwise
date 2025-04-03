import React, { useState, useContext, useEffect } from "react";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
import { useRouter } from "next/router";
import { AuthContext } from "../../contexts/AuthContext";
import { ExpenseContext } from "../../contexts/ExpenseContext";

const SettlementForm = () => {
  const router = useRouter();
  const { friendId } = router.query;
  const { currentUser } = useContext(AuthContext);
  const { friends, calculateBalances, recordPayment } =
    useContext(ExpenseContext);

  const [settlementData, setSettlementData] = useState({
    from: "",
    to: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const [availableFriends, setAvailableFriends] = useState([]);
  const [balances, setBalances] = useState([]);

  // Initialize form if friendId is provided
  useEffect(() => {
    if (friendId && friends) {
      const friend = friends.find((f) => f.id === friendId);
      if (friend) {
        const balance = calculateBalances().find(
          (b) =>
            (b.from === currentUser?.id && b.to === friendId) ||
            (b.to === currentUser?.id && b.from === friendId)
        );

        if (balance) {
          if (balance.from === currentUser?.id) {
            // Current user owes the friend
            setSettlementData((prev) => ({
              ...prev,
              from: currentUser.id,
              to: friendId,
              amount: balance.amount,
            }));
          } else {
            // Friend owes the current user
            setSettlementData((prev) => ({
              ...prev,
              from: friendId,
              to: currentUser.id,
              amount: balance.amount,
            }));
          }
        }
      }
    }
  }, [friendId, friends, currentUser, calculateBalances]);

  // Get balances and available friends
  useEffect(() => {
    if (friends && calculateBalances) {
      const allBalances = calculateBalances();
      setBalances(allBalances);

      // Get friends who have balances
      const friendsWithBalances = allBalances.reduce((acc, balance) => {
        if (balance.from === currentUser?.id) {
          // Current user owes this friend
          const friend = friends.find((f) => f.id === balance.to);
          if (friend) acc.push(friend);
        } else if (balance.to === currentUser?.id) {
          // This friend owes the current user
          const friend = friends.find((f) => f.id === balance.from);
          if (friend) acc.push(friend);
        }
        return acc;
      }, []);

      // Remove duplicates
      const uniqueFriends = [
        ...new Map(
          friendsWithBalances.map((friend) => [friend.id, friend])
        ).values(),
      ];

      setAvailableFriends(uniqueFriends);
    }
  }, [friends, currentUser, calculateBalances]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettlementData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // If "from" changes, update "to" accordingly
    if (name === "from") {
      const isCurrentUser = value === currentUser?.id;

      // Find an appropriate balance for this friend
      const relevantBalance = balances.find(
        (b) =>
          (isCurrentUser && b.from === currentUser?.id && b.to === value) ||
          (!isCurrentUser && b.from === value && b.to === currentUser?.id)
      );

      setSettlementData((prev) => ({
        ...prev,
        to: isCurrentUser ? "" : currentUser?.id,
        amount: relevantBalance ? relevantBalance.amount : "",
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Record the payment
    recordPayment({
      from: settlementData.from,
      to: settlementData.to,
      amount: parseFloat(settlementData.amount),
      date: settlementData.date,
      notes: settlementData.notes,
    });

    // Navigate back to the appropriate page
    if (friendId) {
      router.push(`/friends/${friendId}`);
    } else {
      router.push("/dashboard");
    }
  };

  // Format currency for display
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Get balance information for a specific friend
  const getBalanceWithFriend = (friendId) => {
    const balance = balances.find(
      (b) =>
        (b.from === currentUser?.id && b.to === friendId) ||
        (b.to === currentUser?.id && b.from === friendId)
    );

    if (!balance) return { amount: 0, youOwe: false };

    return {
      amount: parseFloat(balance.amount),
      youOwe: balance.from === currentUser?.id,
    };
  };

  return (
    <Card className="shadow-sm">
      <Card.Header as="h5">Settle Up</Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Who paid?</Form.Label>
                <Form.Select
                  name="from"
                  value={settlementData.from}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select who paid</option>
                  <option value={currentUser?.id}>You</option>
                  {availableFriends.map((friend) => (
                    <option key={friend.id} value={friend.id}>
                      {friend.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Who received the payment?</Form.Label>
                <Form.Select
                  name="to"
                  value={settlementData.to}
                  onChange={handleChange}
                  required
                  disabled={!settlementData.from}
                >
                  <option value="">Select who received</option>
                  {settlementData.from !== currentUser?.id && (
                    <option value={currentUser?.id}>You</option>
                  )}
                  {availableFriends
                    .filter((friend) => friend.id !== settlementData.from)
                    .map((friend) => (
                      <option key={friend.id} value={friend.id}>
                        {friend.name}
                      </option>
                    ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {settlementData.from && settlementData.to && (
            <div className="alert alert-info mb-3">
              {settlementData.from === currentUser?.id
                ? "You owe "
                : "They owe you "}
              {formatCurrency(
                getBalanceWithFriend(
                  settlementData.from === currentUser?.id
                    ? settlementData.to
                    : settlementData.from
                ).amount
              )}
            </div>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="number"
              name="amount"
              value={settlementData.amount}
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
              value={settlementData.date}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Notes (Optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="notes"
              value={settlementData.notes}
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
              Record Payment
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default SettlementForm;
