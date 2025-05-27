import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user on app start
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("data");
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (err) {
        console.error("Error loading user from AsyncStorage:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login and save to AsyncStorage
  const login = async (userData) => {
    try {
      await AsyncStorage.setItem("data", JSON.stringify(userData));
      setUser(userData);
    } catch (err) {
      console.error("Error saving user to AsyncStorage:", err);
    }
  };

  // Logout and remove from AsyncStorage
  const logout = async () => {
    try {
      await AsyncStorage.removeItem("data");
      setUser(null);
    } catch (err) {
      console.error("Error removing user from AsyncStorage:", err);
    }
  };

  return (
    <LoginContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </LoginContext.Provider>
  );
};
