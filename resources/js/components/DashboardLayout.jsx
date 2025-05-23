import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import Topbar from "./Topbar";
import PositionSwitcher from "./PositionSwitcher";

export default function DashboardLayout({ children }) {
    const { currProfile, userType, currPosition } = useContext(AuthContext);
    return (
        <div>
            <Topbar />
            {userType === "EMPLOYEE" && (
                <PositionSwitcher profileId={currProfile.id} />
            )}
            <div className="container mx-auto p-4">
                {children}
                <div className="text-xs text-slate-600 my-2">
                    <em>Current User:</em>{" "}
                    <strong>
                        {currProfile.first_name} ({currPosition.name})
                    </strong>
                </div>
                <div className="text-right pt-2">
                    <div className="text-gray-500 text-xs italic">
                        {"{"} Crafted with ❤️ by Eienn {"}"}
                    </div>
                </div>
            </div>
        </div>
    );
}
