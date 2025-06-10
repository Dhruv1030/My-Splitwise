// src/services/firebase.js
import { initializeApp, getApps } from "firebase/app";
import { get } from "firebase/database";

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
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const db = getDatabase(app);
const auth = getAuth(app);

const getAuthError = (error) => {
  switch (error.code) {
    case "auth/user-not-found":
      return new Error("No account exists with this email");
    case "auth/wrong-password":
      return new Error("Invalid password");
    case "auth/invalid-email":
      return new Error("Invalid email format");
    case "auth/user-disabled":
      return new Error("This account has been disabled");
    case "auth/too-many-requests":
      return new Error("Too many failed attempts. Please try again later");
    default:
      return new Error("Failed to login. Please try again");
  }
};

setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Auth persistence set to browserLocalPersistence");
  })
  .catch((error) => {
    console.error("Error setting auth persistence:", error);
  });

// Authentication functions
export const signUp = async (email, password, userData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Create user profile after successful signup
    await createUserProfile(userCredential.user.uid, {
      email,
      ...userData,
      createdAt: new Date().toISOString(),
    });

    return userCredential.user;
  } catch (error) {
    console.error("Signup error:", error);
    throw getAuthError(error);
  }
};

export const signIn = async (email, password) => {
  try {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Get user profile after successful login
    const userProfile = await getUserProfileOnce(userCredential.user.uid);

    console.log("Login successful:", userCredential.user.email);
    return {
      user: userCredential.user,
      profile: userProfile,
    };
  } catch (error) {
    console.error("Login error:", error.code, error.message);
    throw getAuthError(error);
  }
};

export const logOut = () => {
  return signOut(auth);
};

// User functions
export const createUserProfile = (userId, userData) => {
  return set(ref(db, `users/${userId}`), userData);
};

export const getUserProfileOnce = async (userId) => {
  try {
    const snapshot = await get(ref(db, `users/${userId}`));
    return snapshot.val();
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
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
    console.log("📡 Firebase subscription triggered");

    const data = snapshot.val();
    console.log("🔥 Raw snapshot data:", data);

    const expenses = data
      ? Object.keys(data).map((key) => {
          const expense = data[key];
          return {
            id: key,
            ...expense,
            participants: Array.isArray(expense.participants)
              ? expense.participants
              : Object.values(expense.participants || {}),
          };
        })
      : [];

    console.log("✅ Parsed expenses array:", expenses);
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

// Add this function to check if user is logged in
export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe();
        resolve(user);
      },
      reject
    );
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
