import React, { createContext, useState, useEffect, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { AuthContext } from "./AuthContext";

export const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const [expenses, setExpenses] = useState([]);
  const [groups, setGroups] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // In a real app, these would be API calls
        // For now, we'll use localStorage or mock data

        const storedExpenses = localStorage.getItem("expenses");
        const storedGroups = localStorage.getItem("groups");
        const storedFriends = localStorage.getItem("friends");

        if (storedExpenses) {
          setExpenses(JSON.parse(storedExpenses));
        }

        if (storedGroups) {
          setGroups(JSON.parse(storedGroups));
        }

        if (storedFriends) {
          // console.log("Loading friends from localStorage:", storedFriends);
          setFriends(JSON.parse(storedFriends));
        }

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  // Save data whenever it changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("expenses", JSON.stringify(expenses));
      localStorage.setItem("groups", JSON.stringify(groups));
      localStorage.setItem("friends", JSON.stringify(friends));

      // Verify the data was saved correctly
      const savedFriends = localStorage.getItem("friends");
    }
  }, [expenses, groups, friends, loading]);

  // Add a new expense
  const addExpense = (expenseData) => {
    const newExpense = {
      id: uuidv4(),
      ...expenseData,
      timestamp: new Date().toISOString(),
    };

    setExpenses((prev) => [...prev, newExpense]);
    return newExpense;
  };

  // Update an existing expense
  const updateExpense = (id, expenseData) => {
    setExpenses((prev) =>
      prev.map((expense) =>
        expense.id === id ? { ...expense, ...expenseData } : expense
      )
    );
  };

  // Delete an expense
  const deleteExpense = (id) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
  };

  // Add a new group
  const addGroup = (groupData) => {
    const newGroup = {
      id: uuidv4(),
      ...groupData,
      timestamp: new Date().toISOString(),
    };

    setGroups((prev) => [...prev, newGroup]);
    return newGroup;
  };

  // Update an existing group
  const updateGroup = (id, groupData) => {
    setGroups((prev) =>
      prev.map((group) =>
        group.id === id ? { ...group, ...groupData } : group
      )
    );
  };

  // Delete a group
  const deleteGroup = (id) => {
    setGroups((prev) => prev.filter((group) => group.id !== id));
  };

  // Add a new friend
  const addFriend = (friendData) => {
    const newFriend = {
      id: uuidv4(), // Make sure you're generating a unique ID
      ...friendData,
      timestamp: new Date().toISOString(),
    };

    setFriends((prev) => {
      const updatedFriends = [...(prev || []), newFriend];

      return updatedFriends;
    });

    return newFriend;
  };

  // Delete a friend
  const deleteFriend = (id) => {
    setFriends((prev) => prev.filter((friend) => friend.id !== id));
  };

  // Record a payment (settlement)
  const recordPayment = (paymentData) => {
    // Create a payment expense
    const newPayment = {
      id: uuidv4(),
      description: `Payment: ${
        paymentData.from === currentUser.id
          ? "You"
          : getFriendById(paymentData.from).name
      } paid ${
        paymentData.to === currentUser.id
          ? "you"
          : getFriendById(paymentData.to).name
      }`,
      amount: parseFloat(paymentData.amount),
      paidBy: paymentData.from,
      splitType: "payment",
      date: paymentData.date,
      participants: [
        { id: paymentData.from, amount: 0 },
        { id: paymentData.to, amount: parseFloat(paymentData.amount) },
      ],
      notes: paymentData.notes,
      isPayment: true,
      timestamp: new Date().toISOString(),
    };

    setExpenses((prev) => [...prev, newPayment]);
    return newPayment;
  };

  // Get a friend by ID
  const getFriendById = (id) => {
    return friends.find((friend) => friend.id === id) || null;
  };

  // Get a group by ID
  const getGroupById = (id) => {
    return groups.find((group) => group.id === id) || null;
  };

  // Get expenses for a specific group
  const getExpensesByGroup = (groupId) => {
    return expenses.filter((expense) => expense.groupId === groupId);
  };

  // Get expenses involving a specific friend
  const getExpensesByFriend = (friendId) => {
    return expenses.filter(
      (expense) =>
        expense.paidBy === friendId ||
        expense.participants.some((p) => p.id === friendId)
    );
  };

  // Calculate balances between users
  const calculateBalances = () => {
    const balances = {};

    // Initialize balances for all users
    const allUserIds = [currentUser?.id, ...friends.map((f) => f.id)].filter(
      Boolean
    ); // Filter out any undefined IDs

    allUserIds.forEach((userId) => {
      balances[userId] = {};
      allUserIds.forEach((otherId) => {
        if (userId !== otherId) {
          balances[userId][otherId] = 0;
        }
      });
    });

    // Calculate from expenses
    expenses.forEach((expense) => {
      if (!expense.paidBy || !expense.participants) {
        // Skip expenses with missing data
        return;
      }

      if (expense.isPayment) {
        // Handle payments differently
        const { paidBy, participants } = expense;

        // Find the receiver (the participant who is not the payer)
        const receiverParticipant = participants.find((p) => p.id !== paidBy);
        if (!receiverParticipant) return;

        const receiver = receiverParticipant.id;

        // Make sure both users exist in the balances object
        if (
          !balances[paidBy] ||
          !balances[paidBy][receiver] ||
          !balances[receiver] ||
          !balances[receiver][paidBy]
        ) {
          return;
        }

        balances[paidBy][receiver] += parseFloat(expense.amount);
        balances[receiver][paidBy] -= parseFloat(expense.amount);
      } else {
        // Regular expense
        const { paidBy, participants, amount } = expense;

        participants.forEach((participant) => {
          // Skip if participant is the payer or if IDs are missing/invalid
          if (
            participant.id === paidBy ||
            !balances[participant.id] ||
            !balances[participant.id][paidBy] ||
            !balances[paidBy] ||
            !balances[paidBy][participant.id]
          ) {
            return;
          }

          // This person owes the payer
          const owed =
            expense.splitType === "equal"
              ? parseFloat(amount) / participants.length
              : parseFloat(participant.amount || 0);

          balances[participant.id][paidBy] += owed;
          balances[paidBy][participant.id] -= owed;
        });
      }
    });

    // Simplify balances (net amounts)
    const simplifiedBalances = [];

    Object.keys(balances).forEach((userId) => {
      Object.keys(balances[userId]).forEach((otherId) => {
        if (userId < otherId) {
          // Use string comparison to avoid numeric issues
          const netAmount =
            balances[userId][otherId] + balances[otherId][userId];

          if (Math.abs(netAmount) > 0.01) {
            const fromUser = netAmount > 0 ? userId : otherId;

            const toUser = netAmount > 0 ? otherId : userId;

            simplifiedBalances.push({
              from: fromUser,
              to: toUser,
              amount: Math.abs(netAmount).toFixed(2),
            });
          }
        }
      });
    });

    return simplifiedBalances;
  };

  // Get total owed to user
  const getTotalOwedToUser = () => {
    let total = 0;
    const balances = calculateBalances();

    balances.forEach((balance) => {
      if (balance.to === currentUser.id) {
        total += parseFloat(balance.amount);
      }
    });

    return total.toFixed(2);
  };

  // Get total user owes
  const getTotalUserOwes = () => {
    let total = 0;
    const balances = calculateBalances();

    balances.forEach((balance) => {
      if (balance.from === currentUser.id) {
        total += parseFloat(balance.amount);
      }
    });

    return total.toFixed(2);
  };

  // Get net balance
  const getNetBalance = () => {
    const owed = parseFloat(getTotalOwedToUser());
    const owes = parseFloat(getTotalUserOwes());
    return (owed - owes).toFixed(2);
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        groups,
        friends,
        loading,
        error,
        addExpense,
        updateExpense,
        deleteExpense,
        addGroup,
        updateGroup,
        deleteGroup,
        addFriend,
        deleteFriend,
        recordPayment,
        getFriendById,
        getGroupById,
        getExpensesByGroup,
        getExpensesByFriend,
        calculateBalances,
        getTotalOwedToUser,
        getTotalUserOwes,
        getNetBalance,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export default ExpenseContext;
