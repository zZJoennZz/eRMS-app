import React, { useContext } from "react";

import DashboardLayout from "../components/DashboardLayout";

import EmployeeDashboard from "./Dashboard/EmployeeDashboard";
import RCDashboard from "./Dashboard/RCDashboard";
import BranchHeadDashboard from "./Dashboard/BranchHeadDashboard";
import WarehouseDashboard from "./Dashboard/WarehouseDashboard";

import { AuthContext } from "../contexts/AuthContext";

export default function Dashboard() {
    const { userType, currProfile } = useContext(AuthContext);

    return (
        <DashboardLayout>
            <h1 className="text-3xl font-semibold mb-1 mt-2 text-slate-600 border-b border-slate-300 pb-2">
                Good day, {currProfile.first_name}! 🎊🎉
            </h1>
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
        </DashboardLayout>
    );
}
