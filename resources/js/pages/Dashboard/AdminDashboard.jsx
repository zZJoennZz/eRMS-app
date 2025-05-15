import React from "react";
import { useQuery } from "@tanstack/react-query";

import ComponentLoader from "../../components/ComponentLoader";

import { adminDashboard } from "../../utils/dashboardFn";

import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";

export default function AdminDashboard() {
    const getAcctSummary = useQuery({
        queryKey: ["acctSummary"],
        queryFn: adminDashboard,
        retry: 2,
        networkMode: "always",
    });

    return (
        <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-10">
            <div className="p-3 border border-slate-400 rounded-lg ">
                <div className="text-sm uppercase mb-3 text-slate-500">
                    Needs your attention
                </div>
                <div className="mb-3 rounded-lg bg-gradient-to-r from-lime-700 to-lime-600 text-white p-5">
                    <div className="flex items-center">
                        <div className="text-2xl flex-grow">
                            <a href="/disposals" className="hover:underline">
                            For Review of Records Disposal
                                <ArrowTopRightOnSquareIcon className="ml-1 w-4 h-4 inline" />
                            </a>
                        </div>
                        <div className="text-4xl">
                            {getAcctSummary.isLoading ? (
                                <div className="animate-bounce">...</div>
                            ) : (
                                getAcctSummary.data.pending_disposal
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
