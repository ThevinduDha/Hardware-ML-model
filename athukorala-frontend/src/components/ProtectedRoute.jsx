import React from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  // 1. Check if user is logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  // 2. Check if user has the correct clearance
  if (!allowedRoles.includes(user.role)) {
    toast.error("UNAUTHORIZED ACCESS: INSUFFICIENT CLEARANCE");
    return <Navigate to="/portal" />; // Send them back to the portal
  }

  return children;
};

export default ProtectedRoute;