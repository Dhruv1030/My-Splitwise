// pages/groups/create.js
import { useState } from "react";
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
} from "react-bootstrap";
import { BiGroup, BiArrowBack, BiCheck, BiUser } from "react-icons/bi";

export default function CreateGroup() {
  const router = useRouter();

  // Mock data for friends
  const [allFriends, setAllFriends] = useState([
    { id: 2, name: "Alex Thompson", email: "alex@example.com" },
    { id: 3, name: "Sarah Johnson", email: "sarah@example.com" },
    { id: 4, name: "Mike Wilson", email: "mike@example.com" },
    { id: 5, name: "Emily Davis", email: "emily@example.com" },
    { id: 6, name: "Chris Brown", email: "chris@example.com" },
  ]);

  // Form state
  const [group, setGroup] = useState({
    name: "",
    type: "home", // home, trip, other
    members: [
      {
        id: 1,
        name: "You (Current User)",
        email: "you@example.com",
        selected: true,
      },
    ],
    simplifyDebts: true,
    notes: "",
  });

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setGroup((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add a friend to the group
  const addFriend = (friend) => {
    // Check if friend is already in the group
    if (group.members.some((m) => m.id === friend.id)) {
      return;
    }

    setGroup((prev) => ({
      ...prev,
      members: [...prev.members, { ...friend, selected: true }],
    }));
  };

  // Remove a friend from the group
  const removeFriend = (friendId) => {
    setGroup((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m.id !== friendId),
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!group.name.trim()) {
      alert("Please enter a group name");
      return;
    }

    if (group.members.length < 2) {
      alert("Please add at least one friend to the group");
      return;
    }

    console.log("Creating group:", group);

    // In a real app, you would save this to your backend
    // For now, we'll just redirect back to the groups page
    router.push("/groups");
  };

  // Available friends (not yet added to the group)
  const availableFriends = allFriends.filter(
    (friend) => !group.members.some((m) => m.id === friend.id)
  );

  return (
    <>
      <Head>
        <title>Create a Group - Splitwise</title>
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
            <h1 className="mb-0">Create a group</h1>
          </div>

          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Group Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={group.name}
                        onChange={handleChange}
                        placeholder="Enter a name for your group"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Group Type</Form.Label>
                      <Form.Select
                        name="type"
                        value={group.type}
                        onChange={handleChange}
                      >
                        <option value="home">Home</option>
                        <option value="trip">Trip</option>
                        <option value="couple">Couple</option>
                        <option value="other">Other</option>
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Check
                        type="checkbox"
                        id="simplify-debts"
                        label="Simplify group debts"
                        name="simplifyDebts"
                        checked={group.simplifyDebts}
                        onChange={(e) =>
                          setGroup((prev) => ({
                            ...prev,
                            simplifyDebts: e.target.checked,
                          }))
                        }
                      />
                      <Form.Text className="text-muted">
                        When enabled, Splitwise will simplify debts within the
                        group to minimize the number of payments.
                      </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>Notes (optional)</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="notes"
                        rows={3}
                        placeholder="Add notes about this group"
                        value={group.notes}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <div className="mb-3">
                      <Form.Label>Group Members</Form.Label>
                      <ListGroup className="mb-3">
                        {group.members.map((member) => (
                          <ListGroup.Item
                            key={member.id}
                            className="d-flex justify-content-between align-items-center"
                          >
                            <div>
                              <div className="fw-bold">{member.name}</div>
                              <div className="text-muted small">
                                {member.email}
                              </div>
                            </div>
                            {member.id !== 1 && (
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => removeFriend(member.id)}
                              >
                                Remove
                              </Button>
                            )}
                          </ListGroup.Item>
                        ))}
                      </ListGroup>

                      <Form.Label>Add Friends</Form.Label>
                      <div className="border rounded mb-3">
                        {availableFriends.length === 0 ? (
                          <div className="p-3 text-center text-muted">
                            No more friends to add
                          </div>
                        ) : (
                          availableFriends.map((friend) => (
                            <div
                              key={friend.id}
                              className="d-flex justify-content-between align-items-center p-2 border-bottom"
                            >
                              <div>
                                <div>{friend.name}</div>
                                <div className="text-muted small">
                                  {friend.email}
                                </div>
                              </div>
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => addFriend(friend)}
                              >
                                Add
                              </Button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="d-grid gap-2">
                      <Button type="submit" variant="primary" size="lg">
                        <BiCheck className="me-2" /> Create Group
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
