// src/components/dashboard/ActivityFilters.js
import React from "react";
import { Form } from "react-bootstrap";

const ActivityFilters = ({ onFilterChange }) => {
  return (
    <Form.Group>
      <Form.Label>Filter by</Form.Label>
      <Form.Select onChange={(e) => onFilterChange(e.target.value)}>
        <option value="all">All Activities</option>
        <option value="expenses">Expenses</option>
        <option value="settlements">Settlements</option>
      </Form.Select>
    </Form.Group>
  );
};
