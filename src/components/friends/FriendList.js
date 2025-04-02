import React, { useContext, useEffect } from "react";
import { Card, ListGroup, Button } from "react-bootstrap";
import { useRouter } from "next/router";
import { ExpenseContext } from "../../contexts/ExpenseContext";

const FriendList = () => {
  const router = useRouter();
  const contextValue = useContext(ExpenseContext);
  const { friends, deleteFriend } = contextValue || {};

  // Debugging
  useEffect(() => {}, [contextValue, friends]);

  return (
    <Card className="shadow-sm">
      <Card.Header>
        <h5 className="mb-0">
          Your Friends ({Array.isArray(friends) ? friends.length : "unknown"}{" "}
          friends)
        </h5>
      </Card.Header>

      <ListGroup variant="flush">
        {Array.isArray(friends) && friends.length > 0 ? (
          friends.map((friend) => (
            <ListGroup.Item
              key={friend.id}
              className="d-flex justify-content-between align-items-center p-3"
            >
              <div>
                <h6 className="mb-0">{friend.name}</h6>
                <small className="text-muted">{friend.email}</small>
              </div>

              <div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => deleteFriend && deleteFriend(friend.id)}
                >
                  Remove
                </Button>
              </div>
            </ListGroup.Item>
          ))
        ) : (
          <ListGroup.Item className="text-center py-4">
            <p className="mb-0 text-muted">You haven't added any friends yet</p>
            <div className="mt-2 p-2 bg-light rounded">
              <small>
                Debug info: Friends is{" "}
                {friends
                  ? `defined (${
                      Array.isArray(friends) ? "array" : typeof friends
                    })`
                  : "undefined"}
              </small>
              {Array.isArray(friends) && (
                <small>, length: {friends.length}</small>
              )}
            </div>
            <Button variant="link" onClick={() => router.push("/friends/add")}>
              Add your first friend
            </Button>
          </ListGroup.Item>
        )}
      </ListGroup>
    </Card>
  );
};

export default FriendList;
