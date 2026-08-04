import React, { useContext } from "react";

import DashboardLayout from "../components/DashboardLayout";

import EmployeeDashboard from "./Dashboard/EmployeeDashboard";
import RCDashboard from "./Dashboard/RCDashboard";
import BranchHeadDashboard from "./Dashboard/BranchHeadDashboard";
import WarehouseDashboard from "./Dashboard/WarehouseDashboard";
import AdminDashboard from "./Dashboard/AdminDashboard";
import WHDashboard from "./Dashboard/WHDashboard";

import { AuthContext } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

export default function Dashboard() {
    const { userType, currProfile, branchDetails } = useContext(AuthContext);

    return (
        <DashboardLayout>
            <h1 className="text-3xl font-semibold mb-1 mt-2 text-slate-600 border-b border-slate-300 pb-2">
                Good day, {currProfile.first_name}! 😊
            </h1>
            <div className="flex justify-between items-center mb-4">
                <div className="text-md text-slate-600">
                    (🏦{" "}
                    {userType === "ADMIN" || userType === "DEV"
                        ? "Administrator"
                        : branchDetails.name}
                    )
                </div>

                {/* Audit Trail Button: Only visible to ADMIN and DEV */}
                {(userType === "ADMIN" || userType === "DEV") && (
                    <Link
                        to="/activity-log"
                        className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 border border-slate-300 rounded-md text-slate-600 text-xs font-semibold hover:bg-slate-200 hover:text-slate-800 transition shadow-sm"
                    >
                        🛡️ View Audit Trail
                    </Link>
                )}
            </div>
            <div className="mb-5 text-slate-500 text-xs">
                Stay on top of your work with a quick overview of your progress.
                Here, you'll find a summary of key insights and any pending
                tasks that need your attention. Keep everything organized and up
                to date—all in one place. ✔️📱
            </div>
            {userType === "EMPLOYEE" && <EmployeeDashboard />}
            {userType === "RECORDS_CUST" && <RCDashboard />}
            {userType === "BRANCH_HEAD" && <BranchHeadDashboard />}
            {userType === "WAREHOUSE_CUST" && <WarehouseDashboard />}
            {userType === "WAREHOUSE_HEAD" && <WHDashboard />}
            {(userType === "ADMIN" || userType === "DEV") && <AdminDashboard />}
        </DashboardLayout>
    );
}
