import React, { useContext, useState } from "react";

import { AuthContext } from "../contexts/AuthContext";

import axios from "axios";
import { API_URL } from "../configs/config";

import logoImg from "../img/white-lbsi-logo.png";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { XMarkIcon, Bars3Icon } from "@heroicons/react/24/solid";

import NavigationBar from "./NavigationBar";

import { toast } from "react-toastify";

export default function Sidebar() {
    const [sideBarMode, setSideBarMode] = useState("hide");
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

    function showSidebar() {
        setSideBarMode("show");
    }

    function hideSidebar() {
        setSideBarMode("hide");
    }

    return (
        <div
            className={`transition-all ease-in-out duration-300 bg-gradient-to-t from-emerald-700 to-lime-600 overflow-hidden m-2 md:m-0 md:h-full rounded-xl shadow-2xl shadow-slate-400`}
        >
            <button
                onClick={showSidebar}
                className="absolute top-5 right-5 z-20 md:hidden"
            >
                <Bars3Icon className="w-10 h-10 text-white" />
            </button>
            <div className="p-2 flex md:flex-col md:h-full overflow-hidden">
                <img
                    src={logoImg}
                    alt="LBSi Logo"
                    className="p-2 md:p-4 h-12 md:h-auto md:w-2/4 m-auto"
                />
                <hr />
                <div
                    className={`${
                        sideBarMode === "show"
                            ? "-translate-x-0"
                            : "-translate-x-full"
                    } bg-gradient-to-t from-emerald-700 to-lime-600 md:bg-transparent md:bg-none absolute top-0 left-0 bg-red-500 w-full h-full z-30 transition-all ease-in-out duration-300 md:-translate-x-0 md:relative md:flex-grow`}
                >
                    <div className="absolute top-5 right-5 md:hidden">
                        <button onClick={hideSidebar}>
                            <XMarkIcon className="w-10 h-10 text-white" />
                        </button>
                    </div>
                    <NavigationBar />
                    <div className="absolute bottom-2 right-3 md:bottom-1 md:right-2 md:text-center m-2 md:m-auto">
                        <button
                            onClick={logoutPerform}
                            className="text-white opacity-80"
                        >
                            <ArrowRightOnRectangleIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
