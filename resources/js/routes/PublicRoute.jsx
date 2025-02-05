import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import PreLoader from "../components/PreLoader";

export default function PrivateWrapper() {
    const { isAuth, isLoading } = useContext(AuthContext);
    if (isLoading) return <PreLoader />;
    return !isAuth ? <Outlet /> : <Navigate to="/dashboard" />;
}
