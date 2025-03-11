import React, { useContext, useState } from "react";

import { AuthContext } from "../contexts/AuthContext";

import axios from "axios";
import { API_URL } from "../configs/config";

import logoImg from "../img/erms-logo-white.png";
import { ArrowRightEndOnRectangleIcon } from "@heroicons/react/24/outline";
// import { XMarkIcon, Bars3Icon } from "@heroicons/react/24/solid";

// import NavigationBar from "./NavigationBar";

import { toast } from "react-toastify";

export default function Topbar() {
    const { changeAuth, userType } = useContext(AuthContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    async function logoutPerform() {
        await axios
            .post(`${API_URL}logout`, null, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            })
            .then((res) => {
                toast.success(res.data.message);
                changeAuth(false, 0, 0, {});
            })
            .catch((err) => {
                toast.error("An error occured! You are still logged out.");
                changeAuth(false, 0);
            });
    }

    return (
        <>
            <nav className="bg-gradient-to-tr from-lime-500 to-green-700 p-3 text-white">
                <div className="container mx-auto flex justify-between items-center">
                    {/* Logo */}
                    <a href="/dashboard">
                        <img src={logoImg} alt="eRMS Logo" className="w-24" />
                    </a>
                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden focus:outline-none"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16m-7 6h7"
                            ></path>
                        </svg>
                    </button>
                    {/* Menu Items */}
                    <ul
                        className={`absolute md:static top-16 left-0 w-full md:w-auto bg-green-700 md:bg-transparent p-5 md:p-0 space-y-4 md:space-y-0 md:flex md:space-x-6 items-center transition-all duration-300 ease-in-out ${
                            isMenuOpen ? "block" : "hidden"
                        }`}
                    >
                        <li>
                            <a href="/" className="block md:inline">
                                Dashboard
                            </a>
                        </li>
                        {["EMPLOYEE", "RECORDS_CUST", "BRANCH_HEAD"].includes(
                            userType
                        ) && (
                            <li>
                                <a
                                    href="/rds-records"
                                    className="block md:inline"
                                >
                                    Records
                                </a>
                            </li>
                        )}
                        {["WAREHOUSE_CUST"].includes(userType) && (
                            <li>
                                <a
                                    href="/warehouse-monitoring"
                                    className="block md:inline"
                                >
                                    Records
                                </a>
                            </li>
                        )}
                        {["RECORDS_CUST", "BRANCH_HEAD"].includes(userType) && (
                            <li>
                                <a
                                    href="/disposals"
                                    className="block md:inline"
                                >
                                    Disposals
                                </a>
                            </li>
                        )}
                        {[
                            "WAREHOUSE_CUST",
                            "RECORDS_CUST",
                            "BRANCH_HEAD",
                        ].includes(userType) && (
                            <li>
                                <a
                                    href="/transactions"
                                    className="block md:inline"
                                >
                                    Transactions
                                </a>
                            </li>
                        )}
                        {[
                            "EMPLOYEE",
                            "RECORDS_CUST",
                            "BRANCH_HEAD",
                            "WAREHOUSE_CUST",
                        ].includes(userType) && (
                            <li>
                                <a href="/reports" className="block md:inline">
                                    Reports
                                </a>
                            </li>
                        )}
                        {userType === "DEV" && (
                            <li>
                                <a href="/rds" className="block md:inline">
                                    RDS
                                </a>
                            </li>
                        )}
                        <li>
                            <a href="/settings" className="block md:inline">
                                Settings
                            </a>
                        </li>
                        <li>
                            <button
                                onClick={logoutPerform}
                                className="text-white opacity-80"
                            >
                                <ArrowRightEndOnRectangleIcon className="w-6 h-6" />
                            </button>
                        </li>
                    </ul>
                </div>
            </nav>
        </>
    );
}
