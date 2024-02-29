import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PrivateRoute = () => {
  // Get user from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const { user } = useAuth() || storedUser;
  const isAllowed = user || storedUser;
  return isAllowed ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
