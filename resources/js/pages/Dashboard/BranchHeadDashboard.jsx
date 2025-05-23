import React from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

import ComponentLoader from "../../components/ComponentLoader";

import { bhDashboard } from "../../utils/dashboardFn";

export default function BranchHeadDashboard() {
    const getAcctSummary = useQuery({
        queryKey: ["acctSummary"],
        queryFn: bhDashboard,
        retry: 2,
        networkMode: "always",
    });

    return (
        <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-2">
            <div className="p-3 border border-slate-400 rounded-lg ">
                <div className="text-sm uppercase mb-3 text-slate-500">
                    PENDING FOR APPROVALS
                </div>
                <div className="mb-3 rounded-lg bg-gradient-to-r from-lime-700 to-lime-600 text-white p-5">
                    <div className="flex items-center">
                        <div className="text-2xl flex-grow">
                            <a href="/transactions" className="hover:underline">
                                Records for Storage to Record Center
                                <ArrowTopRightOnSquareIcon className="ml-1 w-4 h-4 inline" />
                            </a>
                        </div>
                        <div className="text-4xl">
                            {getAcctSummary.isLoading ? (
                                <div className="animate-bounce">...</div>
                            ) : (
                                getAcctSummary.data.pending_transfer
                            )}
                        </div>
                    </div>
                </div>
                <div className="mb-3 rounded-lg bg-gradient-to-r from-lime-700 to-lime-600 text-white p-5">
                    <div className="flex items-center">
                        <div className="text-2xl flex-grow">
                            <a href="/transactions" className="hover:underline">
                                Box Withdrawn from Records Center
                                <ArrowTopRightOnSquareIcon className="ml-1 w-4 h-4 inline" />
                            </a>
                        </div>
                        <div className="text-4xl">
                            {getAcctSummary.isLoading ? (
                                <div className="animate-bounce">...</div>
                            ) : (
                                getAcctSummary.data.pending_withdraw
                            )}
                        </div>
                    </div>
                </div>
                <div className="rounded-lg bg-gradient-to-r from-lime-700 to-lime-600 text-white p-5">
                    <div className="flex items-center">
                        <div className="text-2xl flex-grow">
                            <a href="/borrows" className="hover:underline">
                                Records for Retrieval
                                <ArrowTopRightOnSquareIcon className="ml-1 w-4 h-4 inline" />
                            </a>
                        </div>
                        <div className="text-4xl">
                            {getAcctSummary.isLoading ? (
                                <div className="animate-bounce">...</div>
                            ) : (
                                getAcctSummary.data.processing_borrows
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-3 border border-slate-400 rounded-lg ">
                <div className="text-sm uppercase mb-3 text-slate-500">
                    Summary
                </div>
                <div className="columns-2">
                    <div className="mb-3 rounded-lg bg-gradient-to-r from-lime-700 to-lime-600 text-white p-5">
                        <div className="flex items-center">
                            <div className="text-2xl flex-grow">
                                <a
                                    href="/rds-records"
                                    className="hover:underline"
                                >
                                    Total Boxes in Branch
                                    <ArrowTopRightOnSquareIcon className="ml-1 w-4 h-4 inline" />
                                </a>
                            </div>
                            <div className="text-4xl">
                                {getAcctSummary.isLoading ? (
                                    <div className="animate-bounce">...</div>
                                ) : (
                                    getAcctSummary.data.rds_record
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="mb-3 rounded-lg bg-gradient-to-r from-lime-700 to-lime-600 text-white p-5">
                        <div className="flex items-center">
                            <div className="text-2xl flex-grow">
                                <a
                                    href="/rds-records"
                                    className="hover:underline"
                                >
                                    Total Boxes in Records Center
                                    <ArrowTopRightOnSquareIcon className="ml-1 w-4 h-4 inline" />
                                </a>
                            </div>
                            <div className="text-4xl">
                                {getAcctSummary.isLoading ? (
                                    <div className="animate-bounce">...</div>
                                ) : (
                                    getAcctSummary.data.rds_record_warehouse
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="columns-2">
                    <div className="mb-3 rounded-lg bg-gradient-to-r from-lime-700 to-lime-600 text-white p-5">
                        <div className="flex items-center">
                            <div className="text-2xl flex-grow">
                                <a
                                    href="/disposals"
                                    className="hover:underline"
                                >
                                    Upcoming
                                    <br />
                                    Disposals{" "}
                                    <ArrowTopRightOnSquareIcon className="ml-1 w-4 h-4 inline" />
                                </a>
                            </div>
                            <div className="text-4xl">
                                {getAcctSummary.isLoading ? (
                                    <div className="animate-bounce">...</div>
                                ) : (
                                    getAcctSummary.data.upcoming_disposals
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg bg-gradient-to-r from-red-700 to-red-500 text-white font-bold p-5">
                        <div className="flex items-center">
                            <div className="text-2xl flex-grow ">
                                <a
                                    href="/disposals"
                                    className="hover:underline"
                                >
                                    Overdue
                                    <br />
                                    Disposals{" "}
                                    <ArrowTopRightOnSquareIcon className="ml-1 w-4 h-4 inline" />
                                </a>
                            </div>
                            <div className="text-4xl">
                                {getAcctSummary.isLoading ? (
                                    <div className="animate-bounce">...</div>
                                ) : (
                                    getAcctSummary.data.overdue_disposals
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
