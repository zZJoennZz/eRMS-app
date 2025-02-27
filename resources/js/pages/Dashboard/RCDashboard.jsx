import React from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRightCircleIcon } from "@heroicons/react/24/outline";

import ComponentLoader from "../../components/ComponentLoader";

import {
    pending_rds,
    for_disposal,
    rcDashboard,
} from "../../utils/dashboardFn";

import { formatDate } from "../../utils/utilities";

import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";

export default function RCDashboard() {
    const getPendingRds = useQuery({
        queryKey: ["allPendingRds"],
        queryFn: pending_rds,
        retry: 2,
        networkMode: "always",
    });

    const getForDisposal = useQuery({
        queryKey: ["allForDisposal"],
        queryFn: for_disposal,
        retry: 2,
        networkMode: "always",
    });

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
                                Pending Box
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
                                Receive Withdraw
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
                                Pending Borrows
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
                                Pending Returns
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
                                    Total Boxes in Warehouse
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
                    <div className="rounded-lg bg-gradient-to-r from-lime-700 to-lime-600 text-white p-5">
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

            <div className="p-3 bg-gradient-to-tr from-lime-400 to-white rounded-lg shadow-md">
                <div className="text-sm uppercase mb-3 text-slate-500">
                    Upcoming boxes for disposal
                </div>
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="text-left text-sm text-slate-600 border-b border-slate-500">
                                Status
                            </th>
                            <th className="text-left text-sm text-slate-600 border-b border-slate-500">
                                Box Number
                            </th>
                            <th className="text-left text-sm text-slate-600 border-b border-slate-500">
                                Projected Date of Disposal
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {getForDisposal.isLoading ? (
                            <tr>
                                <td colSpan={3}>
                                    <ComponentLoader />
                                </td>
                            </tr>
                        ) : (
                            getForDisposal.data &&
                            getForDisposal.data.upcoming.map((d) => (
                                <tr
                                    id={d.id}
                                    key={d.id}
                                    className="hover:bg-lime-500 hover:text-slate-700 text-slate-600"
                                >
                                    <td className="py-2">{d.status}</td>
                                    <td className="py-2">{d.box_number}</td>
                                    <td className="py-2">
                                        {
                                            d.documents[0]
                                                .projected_date_of_disposal
                                        }
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <div className="p-3 bg-gradient-to-tr from-lime-400 to-white rounded-lg shadow-md">
                <div className="text-sm uppercase mb-3 text-slate-500">
                    Overdue boxes for disposal
                </div>
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="text-left text-sm text-slate-600 border-b border-slate-500">
                                Status
                            </th>
                            <th className="text-left text-sm text-slate-600 border-b border-slate-500">
                                Box Number
                            </th>
                            <th className="text-left text-sm text-slate-600 border-b border-slate-500">
                                Projected Date of Disposal
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {getForDisposal.isLoading ? (
                            <tr>
                                <td colSpan={3}>
                                    <ComponentLoader />
                                </td>
                            </tr>
                        ) : (
                            getForDisposal.data &&
                            getForDisposal.data.overdue.map((d) => (
                                <tr
                                    id={d.id}
                                    key={d.id}
                                    className="hover:bg-lime-500 hover:text-slate-700 text-slate-600"
                                >
                                    <td className="py-2">{d.status}</td>
                                    <td className="py-2">{d.box_number}</td>
                                    <td className="py-2">
                                        {
                                            d.documents[0]
                                                .projected_date_of_disposal
                                        }
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
