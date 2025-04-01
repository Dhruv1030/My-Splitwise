import React, { useState, useContext, useEffect } from "react";
import { Form, Button, Card, ListGroup } from "react-bootstrap";
import { useRouter } from "next/router";
import { AuthContext } from "../../contexts/AuthContext";
import { ExpenseContext } from "../../contexts/ExpenseContext";

const GroupForm = ({ existingGroup = null }) => {
  const router = useRouter();
  const { currentUser } = useContext(AuthContext);
  const { addGroup, updateGroup, friends } = useContext(ExpenseContext);

  const [groupData, setGroupData] = useState({
    name: "",
    description: "",
    members: [],
  });

  // Initialize form with existing group data if editing
  useEffect(() => {
    if (existingGroup) {
      setGroupData({
        name: existingGroup.name,
        description: existingGroup.description || "",
        members: existingGroup.members || [],
      });
    } else {
      // For new groups, add current user by default
      setGroupData((prev) => ({
        ...prev,
        members: currentUser ? [currentUser.id] : [],
      }));
    }
  }, [existingGroup, currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGroupData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMemberToggle = (friendId) => {
    setGroupData((prev) => {
      const updatedMembers = [...prev.members];
      const index = updatedMembers.indexOf(friendId);

      if (index > -1) {
        updatedMembers.splice(index, 1);
      } else {
        updatedMembers.push(friendId);
      }

      return {
        ...prev,
        members: updatedMembers,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Make sure current user is always a member
    let updatedMembers = [...groupData.members];
    if (!updatedMembers.includes(currentUser.id)) {
      updatedMembers.push(currentUser.id);
    }

    const groupToSave = {
      ...groupData,
      members: updatedMembers,
    };

    if (existingGroup) {
      updateGroup(existingGroup.id, groupToSave);
    } else {
      addGroup(groupToSave);
    }

    router.push("/groups");
  };

  return (
    <Card className="shadow-sm">
      <Card.Header as="h5">
        {existingGroup ? "Edit Group" : "Create New Group"}
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Group Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={groupData.name}
              onChange={handleChange}
              placeholder="Enter group name"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description (Optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={groupData.description}
              onChange={handleChange}
              placeholder="Add a description for your group"
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Group Members</Form.Label>
            <Card className="mb-2">
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Form.Check
                    type="checkbox"
                    id="member-current-user"
                    label={`You (${currentUser?.name})`}
                    checked={true}
                    disabled={true}
                    className="mb-0"
                  />
                </ListGroup.Item>

                {friends.map((friend) => (
                  <ListGroup.Item key={friend.id}>
                    <Form.Check
                      type="checkbox"
                      id={`member-${friend.id}`}
                      label={friend.name}
                      checked={groupData.members.includes(friend.id)}
                      onChange={() => handleMemberToggle(friend.id)}
                      className="mb-0"
                    />
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>
            {friends.length === 0 && (
              <p className="text-muted small">
                You haven't added any friends yet. Add friends to include them
                in your group.
              </p>
            )}
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
              {existingGroup ? "Update Group" : "Create Group"}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default GroupForm;
