import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function SettingSidebar({ isSidebarOpen, toggleSideBar }) {
    const { userType } = useContext(AuthContext);
    return (
        <div
            className={`w-64 bg-green-800 text-white p-4 space-y-6 absolute md:relative inset-y-0 left-0 transform ${
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            } md:translate-x-0 transition-transform duration-300 ease-in-out md:rounded-md`}
        >
            <h2 className="text-xs font-bold flex align-middle">
                <button
                    onClick={() => toggleSideBar(!isSidebarOpen)}
                    className="md:hidden text-white focus:outline-none mr-5"
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
                Options
            </h2>
            <nav className="space-y-2">
                <a href="#" className="block p-2 rounded hover:bg-green-700">
                    Account
                </a>
                {["DEV", "ADMIN"].includes(userType) && (
                    <a
                        href="/clusters"
                        className="block p-2 rounded hover:bg-green-700"
                    >
                        Clusters
                    </a>
                )}
                {["DEV", "ADMIN"].includes(userType) && (
                    <a
                        href="/branches"
                        className="block p-2 rounded hover:bg-green-700"
                    >
                        Branches
                    </a>
                )}
                {["DEV", "ADMIN", "BRANCH_HEAD", "RECORDS_CUST"].includes(
                    userType
                ) && (
                    <a
                        href="/users"
                        className="block p-2 rounded hover:bg-green-700"
                    >
                        Users
                    </a>
                )}
                <a
                    href="/dashboard"
                    className="block p-2 rounded hover:bg-green-700"
                >
                    Back to Dashboard
                </a>
            </nav>
        </div>
    );
}
