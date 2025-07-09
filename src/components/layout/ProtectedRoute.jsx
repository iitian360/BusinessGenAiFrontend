import React from "react";
import { Navigate } from "react-router-dom";
import { USER_ROLES } from "../../constants/roles";
import LoadingSpinner from "../ui/LoadingSpinner";

const ProtectedRoute = ({
  children,
  user,
  token,
  loading,
  adminOnly = false,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  if (!token) {
    return <Navigate to="/login" />;
  }

  if (!user) {
    console.log("No user");
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== USER_ROLES.ADMIN) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
