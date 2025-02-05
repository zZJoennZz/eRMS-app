import React from "react";

import Sidebar from "./Sidebar";

export default function DashboardLayout({ children }) {
    return (
        <div className="grid grid-cols-12 md:min-h-screen">
            <div className="col-span-12 md:col-span-4 lg:col-span-3 xl:col-span-2 md:p-4 ">
                <Sidebar />
            </div>
            <div className="col-span-12 md:col-span-8 lg:col-span-9 xl:col-span-10 overflow-y-auto">
                <div className="pt-5 pr-5 pb-5 text-slate-700 h-screen">
                    <div className="border border-gray-400 p-3 bg-gradient-to-bl from-orange-50 to-white rounded-lg">
                        {children}
                        <div className="text-right pt-2">
                            <div className="text-gray-500 text-xs italic">
                                {"{"} Crafted with ❤️ by Eienn {"}"}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
