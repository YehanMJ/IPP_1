import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    const token = localStorage.getItem("token");

    // If no token is found, redirect to login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // If token exists, render the children (protected content)
    return children;
}