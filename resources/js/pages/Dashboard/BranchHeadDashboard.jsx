import React from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRightCircleIcon } from "@heroicons/react/24/outline";

import ComponentLoader from "../../components/ComponentLoader";

import { emp_pending_trans, for_disposal } from "../../utils/dashboardFn";

export default function BranchHeadDashboard() {
    const getEmpPendingTrans = useQuery({
        queryKey: ["pendingTrans"],
        queryFn: emp_pending_trans,
        retry: 2,
        networkMode: "always",
    });

    const getForDisposal = useQuery({
        queryKey: ["allForDisposal"],
        queryFn: for_disposal,
        retry: 2,
        networkMode: "always",
    });

    return (
        <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-2">
            <div className="p-3 bg-gradient-to-tr from-lime-400 to-white rounded-lg shadow-md">
                <div className="text-sm uppercase mb-3 text-slate-500">
                    You have transactions that need your attention.
                </div>
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="text-left text-sm text-slate-600 border-b border-slate-500">
                                Type
                            </th>
                            <th className="text-left text-sm text-slate-600 border-b border-slate-500">
                                Number of Boxes
                            </th>
                            <th className="text-left text-sm text-slate-600 border-b border-slate-500">
                                Date
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {getEmpPendingTrans.isLoading ? (
                            <tr>
                                <td colSpan={3}>
                                    <ComponentLoader />
                                </td>
                            </tr>
                        ) : (
                            getEmpPendingTrans.data &&
                            getEmpPendingTrans.data.map((d) => (
                                <tr
                                    id={d.id}
                                    key={d.id}
                                    className="hover:bg-lime-500 hover:text-slate-700 text-slate-600"
                                >
                                    <td className="py-2">{d.type}</td>
                                    <td className="py-2">
                                        {d.rds_records.length}
                                    </td>
                                    <td className="py-2">
                                        {d.transaction_date}{" "}
                                        <a href="/transactions">
                                            <ArrowRightCircleIcon className="w-6 inline float-right cursor-pointer" />
                                        </a>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <div></div>
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
