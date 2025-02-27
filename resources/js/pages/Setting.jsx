import React, { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";

import DashboardLayout from "../components/DashboardLayout";
import SettingSidebar from "../components/SettingSidebar";

export default function Setting() {
    const { changeAuth, userType } = useContext(AuthContext);
    const [isSidebarOpen, setIsOpenSidebarOpen] = useState(false);

    function toggleSideBar() {
        setIsOpenSidebarOpen(!isSidebarOpen);
    }
    return (
        <DashboardLayout>
            <div className="flex">
                <SettingSidebar
                    isSidebarOpen={isSidebarOpen}
                    toggleSideBar={toggleSideBar}
                />
                <div className="flex-1 flex flex-col">
                    {/* Navbar */}
                    <header className="bg-white shadow-md p-4 flex justify-between items-center">
                        <button
                            onClick={() => setIsOpenSidebarOpen(!isSidebarOpen)}
                            className="md:hidden text-green-800 focus:outline-none"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4 6h16M4 12h16m-7 6h7"
                                ></path>
                            </svg>
                        </button>
                        <h1 className="text-xl font-semibold">Settings</h1>
                    </header>

                    <main className="p-6 flex-1">
                        <p>
                            Welcome to the Settings! Check the sidebar for the
                            settings for each category.
                        </p>
                    </main>
                </div>
            </div>
        </DashboardLayout>
    );
}
