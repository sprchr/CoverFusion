import React, { useState, useEffect } from 'react';
import { auth } from "../../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Stop loading once auth state is resolved
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    // Show a loading state while Firebase processes the authentication state
    return <p className='text-[50px] h-screen  flex justify-center items-center'>Loading...</p>;
  }

  if (!user) {
    // If not authenticated, redirect to login page
    return <Navigate to="/login" />;
  }

  // If authenticated, render the children (CoverLetter)
  return children;
};

export default ProtectedRoute;
