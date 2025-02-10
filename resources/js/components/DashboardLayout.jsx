import React from "react";

import Topbar from "./Topbar";

export default function DashboardLayout({ children }) {
    return (
        <div>
            <Topbar />
            <div className="container mx-auto p-4">
                {children}
                <div className="text-right pt-2">
                    <div className="text-gray-500 text-xs italic">
                        {"{"} Crafted with ❤️ by Eienn {"}"}
                    </div>
                </div>
            </div>
        </div>
    );
}
