// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("token"); // saved after login

    if (!token) {
        return <Navigate to="/" replace />; // redirect to login
    }

    return children;
};

export default ProtectedRoute;
