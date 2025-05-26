// src/services/firebase.js
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  update,
  remove,
} from "firebase/database";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAT_Eu8-3ODUotdSjRj-uMYu9MH9GlTxFI",
  authDomain: "splitwise-de796.firebaseapp.com",
  databaseURL: "https://splitwise-de796-default-rtdb.firebaseio.com",
  projectId: "splitwise-de796",
  storageBucket: "splitwise-de796.firebasestorage.app",
  messagingSenderId: "1090062701611",
  appId: "1:1090062701611:web:98eb7ebc3292aa5999c66e",
  measurementId: "G-0K1FH75BJ8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Auth persistence set to browserLocalPersistence");
  })
  .catch((error) => {
    console.error("Error setting auth persistence:", error);
  });

// Authentication functions
export const signUp = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log("Login successful:", userCredential.user.email);
    return userCredential.user;
  } catch (error) {
    console.error("Login error:", error.code, error.message);
    throw error;
  }
};

export const logOut = () => {
  return signOut(auth);
};

// User functions
export const createUserProfile = (userId, userData) => {
  return set(ref(db, `users/${userId}`), userData);
};

export const getUserProfile = (userId, callback) => {
  return onValue(ref(db, `users/${userId}`), (snapshot) => {
    callback(snapshot.val());
  });
};

// Expense functions
export const addExpenseToDb = (expense) => {
  const expensesRef = ref(db, "expenses");
  return push(expensesRef, expense);
};

export const updateExpenseInDb = (expenseId, expenseData) => {
  return update(ref(db, `expenses/${expenseId}`), expenseData);
};

export const deleteExpenseFromDb = (expenseId) => {
  return remove(ref(db, `expenses/${expenseId}`));
};

export const listenToExpenses = (callback) => {
  const expensesRef = ref(db, "expenses");
  return onValue(expensesRef, (snapshot) => {
    const data = snapshot.val();
    const expenses = data
      ? Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }))
      : [];
    callback(expenses);
  });
};

// Friend functions
export const addFriendToDb = (friend) => {
  const friendsRef = ref(db, "friends");
  return push(friendsRef, friend);
};

export const deleteFriendFromDb = (friendId) => {
  return remove(ref(db, `friends/${friendId}`));
};

export const listenToFriends = (callback) => {
  const friendsRef = ref(db, "friends");
  return onValue(friendsRef, (snapshot) => {
    const data = snapshot.val();
    const friends = data
      ? Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }))
      : [];
    callback(friends);
  });
};
export const checkAuthState = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    console.log("Auth state changed:", user ? "logged in" : "logged out");
    callback(user);
  });
};

// Group functions
export const addGroupToDb = (group) => {
  const groupsRef = ref(db, "groups");
  return push(groupsRef, group);
};

export const updateGroupInDb = (groupId, groupData) => {
  return update(ref(db, `groups/${groupId}`), groupData);
};

export const deleteGroupFromDb = (groupId) => {
  return remove(ref(db, `groups/${groupId}`));
};

export const listenToGroups = (callback) => {
  const groupsRef = ref(db, "groups");
  return onValue(groupsRef, (snapshot) => {
    const data = snapshot.val();
    const groups = data
      ? Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }))
      : [];
    callback(groups);
  });
};

// Settlement functions
export const addSettlementToDb = (settlement) => {
  const settlementsRef = ref(db, "settlements");
  return push(settlementsRef, settlement);
};

export const listenToSettlements = (callback) => {
  const settlementsRef = ref(db, "settlements");
  return onValue(settlementsRef, (snapshot) => {
    const data = snapshot.val();
    const settlements = data
      ? Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }))
      : [];
    callback(settlements);
  });
};

export { db, auth };
