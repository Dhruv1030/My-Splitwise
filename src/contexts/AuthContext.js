import { createContext, useState, useEffect, useContext } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, createUserProfile } from "../services/firebase";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sign up function
  const signup = async (email, password, userData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await createUserProfile(userCredential.user.uid, {
        email,
        ...userData,
        createdAt: new Date().toISOString(),
      });
      return userCredential.user;
    } catch (error) {
      setError(getAuthErrorMessage(error.code));
      throw error;
    }
  };

  // Sign in function
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential.user;
    } catch (error) {
      setError(getAuthErrorMessage(error.code));
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
    } catch (error) {
      setError(getAuthErrorMessage(error.code));
      throw error;
    }
  };

  // Password reset function
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      setError(getAuthErrorMessage(error.code));
      throw error;
    }
  };

  // Clear error helper
  const clearError = () => setError(null);

  // Auth state observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setCurrentUser(user);
        setLoading(false);
        setError(null);
      },
      (error) => {
        setError(getAuthErrorMessage(error.code));
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    loading,
    error,
    signup,
    login,
    logout,
    resetPassword,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Helper function for error messages
const getAuthErrorMessage = (code) => {
  const messages = {
    "auth/user-not-found": "No account exists with this email",
    "auth/wrong-password": "Invalid password",
    "auth/email-already-in-use": "Email already registered",
    "auth/weak-password": "Password should be at least 6 characters",
    "auth/invalid-email": "Invalid email format",
    "auth/network-request-failed":
      "Network error - please check your connection",
    "auth/too-many-requests": "Too many attempts - please try again later",
    "auth/operation-not-allowed": "Email/password sign-in is not enabled",
  };
  return messages[code] || "An unexpected error occurred";
};
