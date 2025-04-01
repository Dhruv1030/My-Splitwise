// pages/settle-up.js
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
  ListGroup,
  Badge,
  Alert,
  InputGroup,
} from "react-bootstrap";
import {
  BiCreditCard,
  BiArrowBack,
  BiCheck,
  BiDollarSign,
  BiCalendar,
} from "react-icons/bi";

export default function SettleUp() {
  const router = useRouter();
  const { userId } = router.query;

  // Mock data for friends
  const [friends, setFriends] = useState([
    {
      id: 2,
      name: "Alex Thompson",
      owesYou: 0,
      youOwe: 85.5,
    },
    {
      id: 3,
      name: "Sarah Johnson",
      owesYou: 150.25,
      youOwe: 0,
    },

    {
      id: 4,
      name: "Mike Wilson",
      owesYou: 75.5,
      youOwe: 0,
    },
  ]);

  // Payment form state
  const [payment, setPayment] = useState({
    to: "",
    from: "1", // Current user ID
    amount: "",
    date: new Date().toISOString().substr(0, 10),
    notes: "",
  });

  // If userId is provided in query, set the initial "to" value
  useEffect(() => {
    if (userId) {
      setPayment((prev) => ({
        ...prev,
        to: userId.toString(),
      }));
    }
  }, [userId]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle direction change (you paid / they paid)
  const handleDirectionChange = (direction) => {
    if (direction === "youPaid") {
      setPayment((prev) => ({
        ...prev,
        from: "1",
        to: prev.to || "",
      }));
    } else {
      setPayment((prev) => ({
        ...prev,
        from: prev.to || "",
        to: "1",
      }));
    }
  };

  // Get selected friend
  const getSelectedFriend = () => {
    const friendId = parseInt(payment.to === "1" ? payment.from : payment.to);
    return friends.find((f) => f.id === friendId);
  };

  // Get recommended amount based on balances
  const getRecommendedAmount = () => {
    const friend = getSelectedFriend();
    if (!friend) return "";

    return payment.to === "1"
      ? friend.owesYou.toFixed(2)
      : friend.youOwe.toFixed(2);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!payment.to || !payment.from) {
      alert("Please select who paid and who received the payment");
      return;
    }

    if (!payment.amount || parseFloat(payment.amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    console.log("Recording payment:", payment);

    // In a real app, you would save this to your backend
    // For now, we'll just redirect back to the dashboard
    router.push("/dashboard");
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const selectedFriend = getSelectedFriend();
  const recommendedAmount = getRecommendedAmount();
  const isYouPaying = payment.from === "1";

  return (
    <>
      <Head>
        <title>Settle Up - Splitwise</title>
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
            <h1 className="mb-0">Settle up</h1>
          </div>

          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6} className="mx-auto">
                    <div className="mb-4">
                      <Form.Label>Who was involved?</Form.Label>
                      <div className="d-flex mb-3">
                        <Button
                          variant={isYouPaying ? "primary" : "outline-primary"}
                          className="w-50 me-2"
                          onClick={() => handleDirectionChange("youPaid")}
                          type="button"
                        >
                          You paid
                        </Button>
                        <Button
                          variant={!isYouPaying ? "primary" : "outline-primary"}
                          className="w-50"
                          onClick={() => handleDirectionChange("theyPaid")}
                          type="button"
                        >
                          They paid
                        </Button>
                      </div>

                      <Form.Group className="mb-4">
                        <Form.Label>
                          {isYouPaying ? "Paid to" : "Paid by"}
                        </Form.Label>
                        <Form.Select
                          name={isYouPaying ? "to" : "from"}
                          value={isYouPaying ? payment.to : payment.from}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select a friend</option>
                          {friends.map((friend) => (
                            <option key={friend.id} value={friend.id}>
                              {friend.name}{" "}
                              {friend.owesYou > 0 &&
                                isYouPaying &&
                                `(owes you ${formatCurrency(friend.owesYou)})`}
                              {friend.youOwe > 0 &&
                                !isYouPaying &&
                                `(you owe ${formatCurrency(friend.youOwe)})`}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>

                      {selectedFriend && (
                        <Alert variant="info" className="mb-4">
                          {isYouPaying ? (
                            <>
                              {selectedFriend.owesYou > 0 ? (
                                <div>
                                  <strong>{selectedFriend.name}</strong> owes
                                  you {formatCurrency(selectedFriend.owesYou)}.
                                </div>
                              ) : selectedFriend.youOwe > 0 ? (
                                <div>
                                  You owe <strong>{selectedFriend.name}</strong>{" "}
                                  {formatCurrency(selectedFriend.youOwe)}.
                                </div>
                              ) : (
                                <div>
                                  You and <strong>{selectedFriend.name}</strong>{" "}
                                  are settled up.
                                </div>
                              )}
                            </>
                          ) : (
                            <>
                              {selectedFriend.youOwe > 0 ? (
                                <div>
                                  You owe <strong>{selectedFriend.name}</strong>{" "}
                                  {formatCurrency(selectedFriend.youOwe)}.
                                </div>
                              ) : selectedFriend.owesYou > 0 ? (
                                <div>
                                  <strong>{selectedFriend.name}</strong> owes
                                  you {formatCurrency(selectedFriend.owesYou)}.
                                </div>
                              ) : (
                                <div>
                                  You and <strong>{selectedFriend.name}</strong>{" "}
                                  are settled up.
                                </div>
                              )}
                            </>
                          )}
                        </Alert>
                      )}

                      <Form.Group className="mb-3">
                        <Form.Label>How much?</Form.Label>
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
                            value={payment.amount}
                            onChange={handleChange}
                            required
                          />
                        </InputGroup>
                        {recommendedAmount && (
                          <div className="mt-2">
                            <Button
                              variant="link"
                              className="p-0"
                              onClick={() =>
                                setPayment((prev) => ({
                                  ...prev,
                                  amount: recommendedAmount,
                                }))
                              }
                            >
                              Suggest:{" "}
                              {formatCurrency(parseFloat(recommendedAmount))}
                            </Button>
                          </div>
                        )}
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
                            value={payment.date}
                            onChange={handleChange}
                          />
                        </InputGroup>
                      </Form.Group>

                      <Form.Group className="mb-4">
                        <Form.Label>Notes (optional)</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="notes"
                          rows={3}
                          placeholder="Add notes about this payment"
                          value={payment.notes}
                          onChange={handleChange}
                        />
                      </Form.Group>

                      <div className="d-grid gap-2">
                        <Button type="submit" variant="primary" size="lg">
                          <BiCheck className="me-2" /> Record Payment
                        </Button>
                        <Button
                          variant="outline-secondary"
                          onClick={() => router.back()}
                        >
                          Cancel
                        </Button>
                      </div>
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
