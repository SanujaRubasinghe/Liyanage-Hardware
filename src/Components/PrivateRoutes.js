import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // Adjust path as needed

const PrivateRoute = ({ element, ...rest }) => {
    const { user } = useContext(AuthContext); // Get the user from context

    return user ? element : <Navigate to="/login" />; // If authenticated, render the component; else redirect
};

export default PrivateRoute;



