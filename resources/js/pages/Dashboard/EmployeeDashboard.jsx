import React from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

import ComponentLoader from "../../components/ComponentLoader";

import { empDashboard } from "../../utils/dashboardFn";

export default function EmployeeDashboard() {
    const getAcctSummary = useQuery({
        queryKey: ["acctSummary"],
        queryFn: empDashboard,
        retry: 2,
        networkMode: "always",
    });

    return (
        <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-2">
            <div className="p-3 border border-slate-400 rounded-lg ">
                <div className="text-sm uppercase mb-3 text-slate-500">
                    Needs your attention
                </div>
                <div className="rounded-lg bg-gradient-to-r from-lime-700 to-lime-600 text-white p-5">
                    <div className="flex items-center">
                        <div className="text-2xl flex-grow">
                            <a href="/borrows" className="hover:underline">
                                For Receiving
                                <ArrowTopRightOnSquareIcon className="ml-1 w-4 h-4 inline" />
                            </a>
                        </div>
                        <div className="text-4xl">
                            {getAcctSummary.isLoading ? (
                                <div className="animate-bounce">...</div>
                            ) : (
                                getAcctSummary.data.for_receiving
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-3 border border-slate-400 rounded-lg ">
                <div className="text-sm uppercase mb-3 text-slate-500">
                    Borrow Summary
                </div>
                <div className="columns-2">
                    <div className="rounded-lg bg-gradient-to-r from-lime-700 to-lime-600 text-white p-5">
                        <div className="flex items-center">
                            <div className="text-2xl flex-grow">
                                <a href="/borrows" className="hover:underline">
                                    On Hand
                                    <ArrowTopRightOnSquareIcon className="ml-1 w-4 h-4 inline" />
                                </a>
                            </div>
                            <div className="text-4xl">
                                {getAcctSummary.isLoading ? (
                                    <div className="animate-bounce">...</div>
                                ) : (
                                    getAcctSummary.data.on_hand
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg bg-gradient-to-r from-lime-700 to-lime-600 text-white p-5">
                        <div className="flex items-center">
                            <div className="text-2xl flex-grow">
                                <a href="/borrows" className="hover:underline">
                                    Pending
                                    <ArrowTopRightOnSquareIcon className="ml-1 w-4 h-4 inline" />
                                </a>
                            </div>
                            <div className="text-4xl">
                                {getAcctSummary.isLoading ? (
                                    <div className="animate-bounce">...</div>
                                ) : (
                                    getAcctSummary.data.pending_borrows
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
