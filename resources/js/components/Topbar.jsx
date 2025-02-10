import React, { useContext, useState } from "react";

import { AuthContext } from "../contexts/AuthContext";

import axios from "axios";
import { API_URL } from "../configs/config";

import logoImg from "../img/erms-logo-white.png";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { XMarkIcon, Bars3Icon } from "@heroicons/react/24/solid";

import NavigationBar from "./NavigationBar";

import { toast } from "react-toastify";

export default function Topbar() {
    const { changeAuth } = useContext(AuthContext);

    async function logoutPerform() {
        await axios
            .post(`${API_URL}logout`, null, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            })
            .then((res) => {
                toast.success(res.data.message);
                changeAuth(false, 0);
            })
            .catch((err) => {
                toast.error("An error occured! You are still logged out.");
                changeAuth(false, 0);
            });
    }

    return (
        <nav className="bg-gradient-to-tr from-lime-500 to-green-700 p-3 text-white">
            <div className="container mx-auto flex justify-between items-center">
                <a href="#">
                    <img
                        src={logoImg}
                        alt="LBSi Logo"
                        style={{ width: "100px" }}
                    />
                </a>
                <button
                    id="menu-toggle"
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
                <ul id="menu" className="hidden md:flex space-x-6">
                    <li>
                        <a href="/">Dashboard</a>
                    </li>
                    <li>
                        <a href="/rds-records">Records</a>
                    </li>
                    <li>
                        <a href="/transactions">Transactions</a>
                    </li>
                    <li>
                        <a href="/rds">RDS</a>
                    </li>
                    <li>
                        <button
                            onClick={logoutPerform}
                            className="text-white opacity-80"
                        >
                            <ArrowRightOnRectangleIcon className="w-6 h-6" />
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
