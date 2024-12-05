import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../../firebase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { setPersistence, browserLocalPersistence } from "firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user); 
    })
    
    return unsubscribe;
  }, []);

  useEffect(() => {
    console.log(isAuthenticated); // Logs the value when isAuthenticated changes
  }, [isAuthenticated]);
  return (
    <AuthContext.Provider value={{ isAuthenticated}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
