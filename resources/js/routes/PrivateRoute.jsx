import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import PreLoader from "../components/PreLoader";

export default function PrivateWrapper({ allowedRoles }) {
    const { isAuth, isLoading, userType } = useContext(AuthContext);
    if (isLoading) return <PreLoader />;

    if (!isAuth) return <Navigate to="/" />;

    if (!allowedRoles.includes(userType))
        return <Navigate to="/unauthorized" />;

    return isAuth ? <Outlet /> : <Navigate to="/" />;
}
