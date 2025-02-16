import React from "react";

import DashboardLayout from "../components/DashboardLayout";

export default function Dashboard() {
    return (
        <DashboardLayout>
            <h1 className="text-xl font-semibold mb-2">Dashboard</h1>
            <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-2">
                <div>1</div>
                <div>1</div>
                <div>1</div>
                <div>1</div>
            </div>
        </DashboardLayout>
    );
}
