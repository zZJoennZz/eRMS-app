import React from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";

export default function SideDrawer({
    showDrawer,
    closeHandler,
    title,
    content,
    twcssWidthClass = "w-96",
}) {
    return (
        <div
            className={`${
                showDrawer ? "w-screen" : "w-0 overflow-hidden p-0 m-0"
            } absolute h-screen top-0 right-0 z-40 bg-slate-800 bg-opacity-50 ease-in-out transition-all duration-100`}
        >
            <div
                className={`${
                    showDrawer
                        ? twcssWidthClass + " overflow-y-auto"
                        : "w-0 overflow-hidden p-0 m-0"
                } absolute right-0 top-0 h-full bg-white z-50 transition-all ease-in-out duration-300`}
            >
                <div className="p-4 bg-gradient-to-r from-emerald-800 to-lime-500">
                    <div className="text-white font-semibold flex items-center">
                        <div className="flex-grow">{title}</div>
                        <div
                            className="hover:bg-white transition-all ease-in-out duration-300 hover:bg-opacity-20 rounded-full p-1 cursor-pointer"
                            onClick={closeHandler}
                        >
                            <XMarkIcon className="w-7 h-7" />
                        </div>
                    </div>
                </div>
                {/* CONTENT */}
                {content}
            </div>
        </div>
    );
}
