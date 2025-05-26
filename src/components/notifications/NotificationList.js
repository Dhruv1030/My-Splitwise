// src/components/notifications/NotificationList.js
import React, { useContext } from "react";
import { ListGroup } from "react-bootstrap";
import { AuthContext } from "../../contexts/AuthContext";

const NotificationList = () => {
  const { currentUser } = useContext(AuthContext);

  return <ListGroup>{/* Notification items */}</ListGroup>;
};
