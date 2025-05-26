// src/contexts/ExpenseContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";
import {
  listenToExpenses,
  listenToGroups,
  listenToFriends,
  addExpenseToDb,
  updateExpenseInDb,
  deleteExpenseFromDb,
  addGroupToDb,
  updateGroupInDb,
  deleteGroupFromDb,
  addFriendToDb,
  deleteFriendFromDb,
} from "../services/firebase";

export const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const [expenses, setExpenses] = useState([]);
  const [groups, setGroups] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Subscribe to Firebase listeners for real-time data
  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }
    const unsubscribeExpenses = listenToExpenses((expensesData) => {
      setExpenses(expensesData);
      setLoading(false);
    });
    const unsubscribeGroups = listenToGroups((groupsData) => {
      setGroups(groupsData);
    });
    const unsubscribeFriends = listenToFriends((friendsData) => {
      setFriends(friendsData);
    });

    // Cleanup subscriptions on unmount
    return () => {
      unsubscribeExpenses();
      unsubscribeGroups();
      unsubscribeFriends();
    };
  }, [currentUser]);

  // Add a new expense using Firebase
  const addExpense = async (expenseData) => {
    try {
      const newExpense = {
        ...expenseData,
        receiptUrl: expenseData.receiptUrl || null,
        timestamp: new Date().toISOString(),
      };
      await addExpenseToDb(newExpense);
      return newExpense;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Update an existing expense using Firebase
  const updateExpense = async (id, expenseData) => {
    try {
      await updateExpenseInDb(id, expenseData);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Delete an expense using Firebase
  const deleteExpense = async (id) => {
    try {
      await deleteExpenseFromDb(id);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Add a new group using Firebase
  const addGroup = async (groupData) => {
    try {
      const newGroup = {
        ...groupData,
        timestamp: new Date().toISOString(),
      };
      await addGroupToDb(newGroup);
      return newGroup;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Update an existing group using Firebase
  const updateGroup = async (id, groupData) => {
    try {
      await updateGroupInDb(id, groupData);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Delete a group using Firebase
  const deleteGroup = async (id) => {
    try {
      await deleteGroupFromDb(id);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Add a new friend using Firebase
  const addFriend = async (friendData) => {
    try {
      const newFriend = {
        ...friendData,
        timestamp: new Date().toISOString(),
      };
      await addFriendToDb(newFriend);
      return newFriend;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Delete a friend using Firebase
  const deleteFriend = async (id) => {
    try {
      await deleteFriendFromDb(id);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Record a payment (settlement) using Firebase.
  // This creates a payment expense; you can later distinguish it via the "isPayment" flag.
  const recordPayment = async (paymentData) => {
    try {
      const newPayment = {
        description: `Payment: ${
          paymentData.from === currentUser.id
            ? "You"
            : getFriendById(paymentData.from)?.name || "Unknown"
        } paid ${
          paymentData.to === currentUser.id
            ? "you"
            : getFriendById(paymentData.to)?.name || "Unknown"
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

      await addExpenseToDb(newPayment);
      return newPayment;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Get a friend by ID from local state
  const getFriendById = (id) => {
    return friends.find((friend) => friend.id === id) || null;
  };

  // Get a group by ID from local state
  const getGroupById = (id) => {
    return groups.find((group) => group.id === id) || null;
  };

  // Get expenses for a specific group from local state
  const getExpensesByGroup = (groupId) => {
    return expenses.filter((expense) => expense.groupId === groupId);
  };

  // Get expenses involving a specific friend from local state
  const getExpensesByFriend = (friendId) => {
    return expenses.filter(
      (expense) =>
        expense.paidBy === friendId ||
        expense.participants.some((p) => p.id === friendId)
    );
  };

  // Calculate balances between users based on local state expenses
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

    // Calculate balances from expenses
    expenses.forEach((expense, index) => {
      console.log(
        `Expense ${index}: ${expense.description}, Paid by: ${expense.paidBy}`
      );

      if (!expense.paidBy || !expense.participants || !expense.amount) {
        console.log("Skipping expense - missing critical data");
        return;
      }

      if (
        expense.participants.length === 1 &&
        expense.participants[0].id === expense.paidBy
      ) {
        console.log("Self-expense - no balance to calculate");
        return;
      }

      const hasValidAmounts = expense.participants.some((p) => p.amount > 0);
      if (!hasValidAmounts && expense.participants.length > 1) {
        console.log("No valid participant amounts - calculating equal split");
        const shareAmount =
          parseFloat(expense.amount) / expense.participants.length;

        expense.participants.forEach((participant) => {
          if (participant.id === expense.paidBy) return;
          if (
            !balances[participant.id] ||
            !balances[participant.id][expense.paidBy]
          ) {
            console.log(
              `Skipping participant ${participant.id} - missing from balances`
            );
            return;
          }
          console.log(
            `${participant.id} owes ${expense.paidBy} ${shareAmount}`
          );
          balances[participant.id][expense.paidBy] += shareAmount;
          balances[expense.paidBy][participant.id] -= shareAmount;
        });
      } else {
        expense.participants.forEach((participant) => {
          if (participant.id === expense.paidBy) return;
          if (
            !balances[participant.id] ||
            !balances[participant.id][expense.paidBy]
          ) {
            console.log(
              `Skipping participant ${participant.id} - missing from balances`
            );
            return;
          }
          const owed = parseFloat(participant.amount || 0);
          if (owed <= 0) return;
          console.log(`${participant.id} owes ${expense.paidBy} ${owed}`);
          balances[participant.id][expense.paidBy] += owed;
          balances[expense.paidBy][participant.id] -= owed;
        });
      }
    });

    // Simplify net balances
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
