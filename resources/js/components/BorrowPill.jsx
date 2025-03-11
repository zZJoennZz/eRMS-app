import React from "react";

export default function BorrowPill({ status }) {
    const statusStyles = {
        PENDING: "bg-slate-400",
        PROCESSING: "bg-slate-600",
        BORROWED: "bg-green-600",
        RECEIVING: "bg-orange-600",
        RETURNING: "bg-blue-600",
        RETURNED: "bg-lime-600",
        DECLINED: "bg-red-600",
    };
    return (
        <div
            className={`px-2 py-1 text-xs text-white ${statusStyles[status]} inline rounded-full`}
        >
            {status.charAt(0) + status.slice(1).toLowerCase()}
        </div>
    );
}
