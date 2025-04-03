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
  // console.log("Full expenses data:", expenses);
  // Calculate balances between users
  const calculateBalances = () => {
    console.log("Starting balance calculation with:", {
      expenses: expenses.length,
      currentUser: currentUser?.id,
      friends: friends.length,
    });

    const balances = {};

    // Initialize balances for all users
    const allUserIds = [currentUser?.id, ...friends.map((f) => f.id)].filter(
      Boolean
    );
    console.log("All user IDs:", allUserIds);

    allUserIds.forEach((userId) => {
      balances[userId] = {};
      allUserIds.forEach((otherId) => {
        if (userId !== otherId) {
          balances[userId][otherId] = 0;
        }
      });
    });

    console.log("Initialized balances:", balances);

    // Calculate from expenses
    expenses.forEach((expense, index) => {
      console.log(
        `Expense ${index}: ${expense.description}, Paid by: ${expense.paidBy}`
      );

      // Skip if missing critical data
      if (!expense.paidBy || !expense.participants || !expense.amount) {
        console.log("Skipping expense - missing critical data");
        return;
      }

      // Skip self-expenses (expenses with only the payer as participant)
      if (
        expense.participants.length === 1 &&
        expense.participants[0].id === expense.paidBy
      ) {
        console.log("Self-expense - no balance to calculate");
        return;
      }

      // For expenses with 0 participant amounts, calculate equal split
      const hasValidAmounts = expense.participants.some((p) => p.amount > 0);
      if (!hasValidAmounts && expense.participants.length > 1) {
        console.log("No valid participant amounts - calculating equal split");
        const shareAmount =
          parseFloat(expense.amount) / expense.participants.length;

        expense.participants.forEach((participant) => {
          // Skip if participant is the payer
          if (participant.id === expense.paidBy) return;

          // Skip if IDs are missing from balances
          if (
            !balances[participant.id] ||
            !balances[participant.id][expense.paidBy] ||
            !balances[expense.paidBy] ||
            !balances[expense.paidBy][participant.id]
          ) {
            console.log(
              `Skipping participant ${participant.id} - missing from balances`
            );
            return;
          }

          // This person owes the payer
          console.log(
            `${participant.id} owes ${expense.paidBy} ${shareAmount}`
          );
          balances[participant.id][expense.paidBy] += shareAmount;
          balances[expense.paidBy][participant.id] -= shareAmount;
        });
      } else {
        // Regular expense with valid participant amounts
        expense.participants.forEach((participant) => {
          // Skip if participant is the payer
          if (participant.id === expense.paidBy) return;

          // Skip if IDs are missing from balances
          if (
            !balances[participant.id] ||
            !balances[participant.id][expense.paidBy] ||
            !balances[expense.paidBy] ||
            !balances[expense.paidBy][participant.id]
          ) {
            console.log(
              `Skipping participant ${participant.id} - missing from balances`
            );
            return;
          }

          // This person owes the payer
          const owed = parseFloat(participant.amount || 0);
          if (owed <= 0) return; // Skip if amount is 0 or negative

          console.log(`${participant.id} owes ${expense.paidBy} ${owed}`);
          balances[participant.id][expense.paidBy] += owed;
          balances[expense.paidBy][participant.id] -= owed;
        });
      }
    });

    // Simplify balances (net amounts)
    const simplifiedBalances = [];

    Object.keys(balances).forEach((userId) => {
      Object.keys(balances[userId]).forEach((otherId) => {
        if (userId < otherId) {
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

    console.log("Final simplified balances:", simplifiedBalances);
    return simplifiedBalances;
  };

  // Get total owed to user
  const getTotalOwedToUser = () => {
    let total = 0;
    const balances = calculateBalances();

    balances.forEach((balance) => {
      if (balance.to === currentUser?.id) {
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
      if (balance.from === currentUser?.id) {
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
