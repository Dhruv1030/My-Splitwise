import React, { createContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from localStorage on component mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("currentUser");
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (!loading && currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    }
  }, [currentUser, loading]);

  // Register a new user
  const register = (userData) => {
    try {
      const newUser = {
        id: uuidv4(),
        ...userData,
        createdAt: new Date().toISOString(),
      };

      setCurrentUser(newUser);
      localStorage.setItem("currentUser", JSON.stringify(newUser));
      return newUser;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Login an existing user
  const login = (email, password) => {
    try {
      // In a real app, this would validate against a database
      // For demo purposes, we'll just create a mock user
      const mockUser = {
        id: "1",
        name: "Demo User",
        email: email,
        createdAt: new Date().toISOString(),
      };

      setCurrentUser(mockUser);
      localStorage.setItem("currentUser", JSON.stringify(mockUser));
      return mockUser;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Logout the current user
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        error,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
