import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // 👇 Redirect to new private login route
    return <Navigate to="/w1s3n3r9y-p0rt4l" replace />;
  }

  return children;
};

export default ProtectedRoute;
