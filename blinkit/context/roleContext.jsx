// context/AuthContext.js

import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
// import {  / } from "react";

export const AuthNewContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    role: "", 
  });

  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("data");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser({
            name: parsedUser.name || "",
            email: parsedUser.email || "",
            phone: parsedUser.phone || "",
            role: parsedUser.role || "",  // trim to avoid trailing \n
          });
        }
      } catch (error) {
        console.error("Failed to load user from AsyncStorage:", error);
      }
    };

    loadUserFromStorage();
  }, []);

 

  return (
    <AuthNewContext.Provider value={{  user }}>
      {children}
    </AuthNewContext.Provider>
  );
};
