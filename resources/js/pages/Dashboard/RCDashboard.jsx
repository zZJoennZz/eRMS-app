import React from "react";
import { useQuery } from "@tanstack/react-query";
import { rcDashboard } from "../../utils/dashboardFn";

import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";

export default function RCDashboard() {
    const getAcctSummary = useQuery({
        queryKey: ["acctSummary"],
        queryFn: rcDashboard,
        retry: 2,
        networkMode: "always",
    });

    return (
        <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-2">
            <div className="p-3 border border-slate-400 rounded-lg ">
                <div className="text-sm uppercase mb-3 text-slate-500">
                    Needs your attention
                </div>
                <div className="mb-3 rounded-lg bg-gradient-to-r from-lime-700 to-lime-600 text-white p-5">
                    <div className="flex items-center">
                        <div className="text-2xl flex-grow">
                            <a href="/rds-records" className="hover:underline">
                                Records for Storage
                                <ArrowTopRightOnSquareIcon className="ml-1 w-4 h-4 inline" />
                            </a>
                        </div>
                        <div className="text-4xl">
                            {getAcctSummary.isLoading ? (
                                <div className="animate-bounce">...</div>
                            ) : (
                                getAcctSummary.data.pending_boxes
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
                                getAcctSummary.data.receiving
                            )}
                        </div>
                    </div>
                </div>
                <div className="mb-3 rounded-lg bg-gradient-to-r from-lime-700 to-lime-600 text-white p-5">
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
                                getAcctSummary.data.pending_borrows
                            )}
                        </div>
                    </div>
                </div>
                <div className="rounded-lg bg-gradient-to-r from-lime-700 to-lime-600 text-white p-5">
                    <div className="flex items-center">
                        <div className="text-2xl flex-grow">
                            <a href="/borrows" className="hover:underline">
                                Records for Return
                                <ArrowTopRightOnSquareIcon className="ml-1 w-4 h-4 inline" />
                            </a>
                        </div>
                        <div className="text-4xl">
                            {getAcctSummary.isLoading ? (
                                <div className="animate-bounce">...</div>
                            ) : (
                                getAcctSummary.data.pending_returns
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
                                    Total Boxes<br />in BU
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
                            <div className="text-2xl flex-grow">
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
