import React, { useContext, useEffect, useState } from "react";
import { auth, googleHandler, handleSignOut } from "../firebase"

// Creating Context
const AuthContext = React.createContext();

// Using Created Context a
export function useAuth() {
  return useContext(AuthContext);
}

// Creating Provider
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogIn = () => {
    googleHandler();
  };
  const handleLogOut = () => {
    handleSignOut()
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });
    return unsubscribe;
  });

  const value = {
    currentUser,
    handleLogIn,
    handleLogOut
  };
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}