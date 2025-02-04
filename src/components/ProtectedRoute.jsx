import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element, allowedRoles }) => {
  const userRole = localStorage.getItem("role");

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />; // Redirect unauthorized users to the login page.
  }

  return element;
};

export default ProtectedRoute;
