// Add this as src/utils/MockExpenseFactory.js
import { v4 as uuidv4 } from "uuid";

export const createMockExpense = ({
  description,
  amount,
  paidBy,
  participants,
  date = new Date().toISOString().split("T")[0],
  splitType = "equal",
  groupId = "",
  notes = "",
}) => {
  // Validate inputs
  if (
    !description ||
    !amount ||
    !paidBy ||
    !participants ||
    !Array.isArray(participants)
  ) {
    console.error("Missing required fields for creating mock expense");
    return null;
  }

  // Create the expense object
  return {
    id: uuidv4(),
    description,
    amount: parseFloat(amount),
    date,
    paidBy,
    splitType,
    groupId,
    participants,
    notes,
    timestamp: new Date().toISOString(),
  };
};

export const createSampleExpenses = (currentUserId, friendIds) => {
  if (!currentUserId || !friendIds || friendIds.length === 0) {
    console.error("Need user ID and at least one friend ID");
    return [];
  }

  const firstFriendId = friendIds[0];
  const secondFriendId = friendIds.length > 1 ? friendIds[1] : firstFriendId;

  // Create sample expenses
  return [
    // Expense 1: You paid for dinner, split with a friend
    createMockExpense({
      description: "Dinner",
      amount: 80,
      paidBy: currentUserId,
      participants: [
        { id: currentUserId, amount: 40 },
        { id: firstFriendId, amount: 40 },
      ],
      notes: "At the Italian restaurant",
    }),

    // Expense 2: Friend paid for movie tickets
    createMockExpense({
      description: "Movie tickets",
      amount: 30,
      paidBy: firstFriendId,
      participants: [
        { id: firstFriendId, amount: 15 },
        { id: currentUserId, amount: 15 },
      ],
    }),

    // Expense 3: Group expense
    createMockExpense({
      description: "Groceries",
      amount: 150,
      paidBy: currentUserId,
      participants: [
        { id: currentUserId, amount: 50 },
        { id: firstFriendId, amount: 50 },
        { id: secondFriendId, amount: 50 },
      ],
      splitType: "equal",
    }),
  ];
};
