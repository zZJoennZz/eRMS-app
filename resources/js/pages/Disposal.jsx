import React, { useContext, useState } from "react";

// import axios from "axios";

import DashboardLayout from "../components/DashboardLayout";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    all,
    post,
    approve,
    confirmDispose,
    declineDispose,
    authDispose,
} from "../utils/disposalFn";

import { toast } from "react-toastify";

import { AuthContext } from "../contexts/AuthContext";

import SideDrawer from "../components/SideDrawer";
import ComponentLoader from "../components/ComponentLoader";

import { CheckCircleIcon } from "@heroicons/react/24/solid";

import { formatDate, calculateAging } from "../utils/utilities";
import { API_URL } from "../configs/config";
import { XCircleIcon } from "@heroicons/react/24/outline";

export default function Disposal() {
    const [filterLocation, setFilterLocation] = useState("All");
    const [selectAll, setSelectAll] = useState(false);
    const { userType } = useContext(AuthContext);

    const queryClient = useQueryClient();
    const recordsForDisposals = useQuery({
        queryKey: ["recordsForDisposals"],
        queryFn: all,
        retry: 2,
        networkMode: "always",
    });

    const [cart, setCart] = useState([]);

    const toggleCart = (product) => {
        if (cart.some((item) => item.id === product.id)) {
            setCart(cart.filter((item) => item.id !== product.id));
        } else {
            setCart([...cart, product]);
        }
    };

    const authApproval = useMutation({
        mutationFn: (id) => authDispose(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["recordsForDisposals"],
            });
            toast.success("Disposal has been authorized.");
        },
        onError: (err) => {
            toast.error(err.response.data.message);
        },
        networkMode: "always",
    });

    const processApproval = useMutation({
        mutationFn: (id) => approve(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["recordsForDisposals"],
            });
            toast.success("Disposal has been approved.");
        },
        onError: (err) => {
            toast.error(err.response.data.message);
        },
        networkMode: "always",
    });

    const processDisposal = useMutation({
        mutationFn: () => post({ cart, location: filterLocation }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["recordsForDisposals"],
            });
            setCart([]);
            toast.success("Disposal has been submitted.");
        },
        onError: (err) => {
            toast.error(err.response.data.message);
        },
        networkMode: "always",
    });

    const confirmDisposal = useMutation({
        mutationFn: (id) => confirmDispose(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["recordsForDisposals"],
            });
            toast.success("Disposal has been confirmed.");
            setCart([]);
        },
        onError: (err) => {
            toast.error(err.response.data.message);
            setCart([]);
        },
        networkMode: "always",
    });

    const declineDisposal = useMutation({
        mutationFn: (id) => declineDispose(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["recordsForDisposals"],
            });
            toast.success("Disposal has been declined.");
            setCart([]);
        },
        onError: (err) => {
            toast.error(err.response.data.message);
            setCart([]);
        },
        networkMode: "always",
    });

    function confirmSubmitDisposal() {
        let boxWithDocumentsWithCondition = cart.filter((parent) =>
            parent.documents.some((doc) => doc.rds.has_condition === 1)
        );
        let boxes = [];
        if (boxWithDocumentsWithCondition.length > 0) {
            boxWithDocumentsWithCondition.forEach((d) => {
                boxes = [...boxes, d.box_number];
            });
        }
        let confirmConditions = confirm(
            `The boxes ${boxes.map(
                (d) => d
            )} contain documents that have conditions that must be met before disposal. Can you confirm whether these conditions were met?`
        );

        if (confirmConditions) {
            processDisposal.mutate();
        } else {
            alert(
                "Please make sure all the conditions for the documents were met!"
            );
        }
    }

    function authSubmission(id) {
        if (confirm("Are you sure to authorize this?")) {
            authApproval.mutate(id);
        }
    }

    function approveSubmission(id) {
        if (confirm("Are you sure to approve this?")) {
            processApproval.mutate(id);
        }
    }

    function confirmBoxDisposal(id) {
        if (
            confirm(
                "Are you sure to confirm the disposal of these boxes? Proceeding will mark the boxes as disposed and cannot be used in the future."
            )
        ) {
            confirmDisposal.mutate(id);
        }
    }

    function confirmDeclineDispose(id) {
        if (confirm("Are you sure to decline the disposal request?")) {
            declineDisposal.mutate(id);
        }
    }

    const filterData = (data) => {
        if (filterLocation === "All") return data;

        if (filterLocation === "Warehouse") {
            return data.filter(
                (item) => item.latest_history?.location === "Warehouse"
            );
        } else {
            return data.filter(
                (item) => item.latest_history?.location !== "Warehouse"
            );
        }
    };

    function selectAllBoxes() {
        // console.log([
        //     ...filterData(recordsForDisposals.data?.upcoming || []),
        //     ...filterData(recordsForDisposals.data?.overdue || []),
        // ]);
        // return;
        if (filterLocation === "All") {
            return false;
        }
        if (selectAll) {
            setCart([]);
        } else {
            setCart([
                ...filterData(recordsForDisposals.data?.upcoming || []),
                ...filterData(recordsForDisposals.data?.overdue || []),
            ]);
        }
        setSelectAll(!selectAll);
    }

    return (
        <DashboardLayout>
            {userType === "RECORDS_CUST" && (
                <button
                    className={`bottom-6 right-6 bg-gradient-to-r from-pink-500 to-red-500 text-white text-lg font-bold py-3 px-6 rounded-full ${
                        cart.length > 0 ? "fixed" : "hidden"
                    } shadow-lg hover:scale-110 transform transition-all duration-300 focus:outline-none animate-pulse`}
                    onClick={confirmSubmitDisposal}
                >
                    Submit Disposal
                </button>
            )}
            <h1 className="text-xl font-semibold mb-1">Disposals</h1>
            <div className="mb-3 flex gap-3">
                <label className="font-semibold">Filter by Location:</label>
                <select
                    value={filterLocation}
                    onChange={(e) => {
                        setCart([]);
                        setFilterLocation(e.target.value);
                        setSelectAll(false);
                    }}
                    className="border border-gray-300 p-1 rounded"
                >
                    <option value="All">All</option>
                    <option value="Branch">Branch</option>
                    <option value="Warehouse">Records Center</option>
                </select>
            </div>
            <div className="text-xs mb-5">
                You can process the upcoming and overdue boxes at the same time.
            </div>
            {filterLocation !== "All" && userType === "RECORDS_CUST" && (
                <div className="mb-4">
                    <button
                        className={`bg-green-700 text-white px-2 py-1 rounded-full text-sm`}
                        onClick={selectAllBoxes}
                    >
                        {selectAll ? "Unselect all" : "Select All"}
                    </button>
                </div>
            )}
            {userType !== "DEV" && userType !== "ADMIN" && (
                <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-2 mb-5">
                    <div className="overflow-x-auto bg-gradient-to-r from-lime-100 to-green-50 shadow-md shadow-blue-200 rounded-lg p-4">
                        <h2 className="font-semibold mb-2">
                            Upcoming Disposal/s
                        </h2>
                        <table className="mb-3 w-full">
                            <thead className="text-center text-xs font-semibold border-t border-b border-lime-600">
                                <tr>
                                    <th></th>
                                    <th className="text-left py-2">
                                        Box Number
                                    </th>
                                    <th className="text-left py-2">
                                        # of Documents
                                    </th>
                                    <th className="text-left py-2">
                                        Projected Disposal Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {recordsForDisposals.isLoading ? (
                                    <tr>
                                        <td colSpan={4}>
                                            <ComponentLoader />
                                        </td>
                                    </tr>
                                ) : (
                                    recordsForDisposals.data &&
                                    filterData(
                                        recordsForDisposals.data?.upcoming || []
                                    ).map((data) => {
                                        let sasd = "sad";

                                        return (
                                            <tr
                                                key={data.id}
                                                id={data.id}
                                                className="group cursor-pointer hover:bg-white transition-all ease-in-out duration-300"
                                            >
                                                <td className="py-2 text-left border-b border-slate-300">
                                                    {userType ===
                                                        "RECORDS_CUST" &&
                                                        filterLocation !==
                                                            "All" && (
                                                            <button
                                                                type="button"
                                                                className={`mx-1 px-2 py-1 text-xs duration-300 rounded ${
                                                                    cart.some(
                                                                        (
                                                                            item
                                                                        ) =>
                                                                            item.id ===
                                                                            data.id
                                                                    )
                                                                        ? "bg-green-500 text-white border border-green-500"
                                                                        : "bg-green-700 text-white border border-green-700"
                                                                }`}
                                                                onClick={() =>
                                                                    toggleCart(
                                                                        data
                                                                    )
                                                                }
                                                            >
                                                                {cart.some(
                                                                    (item) =>
                                                                        item.id ===
                                                                        data.id
                                                                )
                                                                    ? "-"
                                                                    : "+"}
                                                            </button>
                                                        )}
                                                </td>
                                                <td className="py-2 text-left border-b border-slate-300">
                                                    <a
                                                        href={`/rds-record-history/${data.id}`}
                                                        target="_blank"
                                                        className="text-lime-700 hover:text-lime-500 transition-all ease-in-out duration-300"
                                                    >
                                                        {data.box_number}
                                                    </a>
                                                </td>
                                                <td className="py-2 text-left border-b border-slate-300">
                                                    {data.documents.length}
                                                </td>
                                                <td className="py-2 text-left border-b border-slate-300">
                                                    {formatDate(
                                                        data.documents[0]
                                                            .projected_date_of_disposal
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="overflow-x-auto bg-gradient-to-r from-pink-200 to-red-100 shadow-md shadow-blue-200 rounded-lg p-4">
                        <h2 className="font-semibold mb-2">
                            Overdue Disposal/s
                        </h2>
                        <table className="mb-3 w-full">
                            <thead className="text-center text-xs font-semibold border-t border-b border-lime-600">
                                <tr>
                                    <th></th>
                                    <th className="text-left py-2">
                                        Box Number
                                    </th>
                                    <th className="text-left py-2">
                                        # of Documents
                                    </th>
                                    <th className="text-left py-2">
                                        Projected Disposal Date
                                    </th>
                                    <th className="text-left py-2">
                                        Days Overdue
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {recordsForDisposals.isLoading ? (
                                    <tr>
                                        <td colSpan={4}>
                                            <ComponentLoader />
                                        </td>
                                    </tr>
                                ) : (
                                    recordsForDisposals.data &&
                                    filterData(
                                        recordsForDisposals.data?.overdue || []
                                    ).map((data) => (
                                        <tr
                                            key={data.id}
                                            id={data.id}
                                            className="group cursor-pointer hover:bg-white transition-all ease-in-out duration-300"
                                        >
                                            <td className="py-2 text-left border-b border-slate-300">
                                                {userType === "RECORDS_CUST" &&
                                                    filterLocation !==
                                                        "All" && (
                                                        <button
                                                            type="button"
                                                            className={`mx-1 px-2 py-1 text-xs duration-300 rounded ${
                                                                cart.some(
                                                                    (item) =>
                                                                        item.id ===
                                                                        data.id
                                                                )
                                                                    ? "bg-green-500 text-white border border-green-500"
                                                                    : "bg-green-700 text-white border border-green-700"
                                                            }`}
                                                            onClick={() =>
                                                                toggleCart(data)
                                                            }
                                                        >
                                                            {cart.some(
                                                                (item) =>
                                                                    item.id ===
                                                                    data.id
                                                            )
                                                                ? "-"
                                                                : "+"}
                                                        </button>
                                                    )}
                                            </td>
                                            <td className="py-2 text-left border-b border-slate-300">
                                                <a
                                                    href={`/rds-record-history/${data.id}`}
                                                    target="_blank"
                                                    className="text-lime-700 hover:text-lime-500 transition-all ease-in-out duration-300"
                                                >
                                                    {data.box_number}
                                                </a>
                                            </td>
                                            <td className="py-2 text-left border-b border-slate-300">
                                                {data.documents.length}
                                            </td>
                                            <td className="py-2 text-left border-b border-slate-300">
                                                {formatDate(
                                                    data.documents[0]
                                                        .projected_date_of_disposal
                                                )}
                                            </td>
                                            <td className="py-2 text-left border-b border-slate-300">
                                                {calculateAging(
                                                    data.documents[0]
                                                        .projected_date_of_disposal
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            <div className="overflow-x-auto bg-gradient-to-r from-slate-200 to-gray-100 shadow-md shadow-blue-200 rounded-lg p-4 mb-5">
                <h2 className="font-semibold mb-2">Submitted Disposal/s</h2>
                <table className="mb-3 w-full">
                    <thead className="text-center text-xs font-semibold border-t border-b border-lime-600">
                        <tr>
                            <th className="text-left py-2">Status</th>
                            <th className="text-left py-2">Date Submitted</th>
                            <th className="text-left py-2"># of Boxes</th>
                            <th className="text-left py-2">Submitted By</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recordsForDisposals.isLoading ? (
                            <tr>
                                <td colSpan={4}>
                                    <ComponentLoader />
                                </td>
                            </tr>
                        ) : (
                            recordsForDisposals.data &&
                            recordsForDisposals.data.pending.map((data) => {
                                let sasd = "sad";

                                return (
                                    <tr
                                        key={data.id}
                                        id={data.id}
                                        className="group cursor-pointer hover:bg-white transition-all ease-in-out duration-300"
                                    >
                                        <td className="py-2 text-left border-b border-slate-300">
                                            <div
                                                className={`inline ${
                                                    data.status === "PENDING" &&
                                                    "bg-gray-500"
                                                } ${
                                                    data.status ===
                                                        "AUTHORIZED" &&
                                                    "bg-lime-600"
                                                } ${
                                                    data.status ===
                                                        "APPROVED" &&
                                                    "bg-blue-500"
                                                } ${
                                                    data.status ===
                                                        "DECLINED" &&
                                                    "bg-red-500"
                                                } text-white text-xs px-2 py-1 rounded-full`}
                                            >
                                                {data.status}
                                            </div>

                                            <a
                                                href={`/report/disposed-records-form/${data.id}`}
                                                target="_blank"
                                            >
                                                <div className="text-xs inline bg-green-500 text-green-800 rounded-full px-2 py-1 ml-2">
                                                    Click to view report
                                                </div>
                                            </a>
                                        </td>
                                        <td className="py-2 text-left border-b border-slate-300">
                                            {formatDate(data.created_at)}
                                        </td>
                                        <td className="py-2 text-left border-b border-slate-300">
                                            {data.items.length}
                                        </td>
                                        <td className="py-2 text-left border-b border-slate-300">
                                            {data.user.profile.first_name}{" "}
                                            {data.user.profile.middle_name}{" "}
                                            {data.user.profile.last_name}
                                            {userType === "BRANCH_HEAD" &&
                                                data.status === "PENDING" && (
                                                    <button
                                                        type="button"
                                                        className={`mx-1 float-right px-2 py-1 text-xs duration-300 rounded bg-green-700 text-white`}
                                                        onClick={() =>
                                                            authSubmission(
                                                                data.id
                                                            )
                                                        }
                                                    >
                                                        Authorize{" "}
                                                        <CheckCircleIcon className="w-5 h-5 inline" />
                                                    </button>
                                                )}
                                            {(userType === "ADMIN" ||
                                                userType === "DEV") &&
                                                data.status ===
                                                    "AUTHORIZED" && (
                                                    <button
                                                        type="button"
                                                        className={`mx-1 float-right px-2 py-1 text-xs duration-300 rounded bg-green-700 text-white`}
                                                        onClick={() =>
                                                            approveSubmission(
                                                                data.id
                                                            )
                                                        }
                                                    >
                                                        Approve{" "}
                                                        <CheckCircleIcon className="w-5 h-5 inline" />
                                                    </button>
                                                )}
                                            {(userType === "ADMIN" ||
                                                userType === "DEV") &&
                                                data.status ===
                                                    "AUTHORIZED" && (
                                                    <button
                                                        type="button"
                                                        className={`mx-1 float-right px-2 py-1 text-xs duration-300 rounded bg-green-700 text-white`}
                                                        onClick={() =>
                                                            confirmDeclineDispose(
                                                                data.id
                                                            )
                                                        }
                                                    >
                                                        Decline{" "}
                                                        <XCircleIcon className="w-5 h-5 inline" />
                                                    </button>
                                                )}
                                            {userType === "BRANCH_HEAD" &&
                                                data.status === "PENDING" && (
                                                    <button
                                                        type="button"
                                                        className={`mx-1 float-right px-2 py-1 text-xs duration-300 rounded bg-green-700 text-white`}
                                                        onClick={() =>
                                                            confirmDeclineDispose(
                                                                data.id
                                                            )
                                                        }
                                                    >
                                                        Decline{" "}
                                                        <XCircleIcon className="w-5 h-5 inline" />
                                                    </button>
                                                )}
                                            {userType === "BRANCH_HEAD" &&
                                                data.status === "APPROVED" && (
                                                    <button
                                                        type="button"
                                                        className={`mx-1 float-right px-2 py-1 text-xs duration-300 rounded bg-green-700 text-white`}
                                                        onClick={() =>
                                                            confirmBoxDisposal(
                                                                data.id
                                                            )
                                                        }
                                                    >
                                                        Confirm Disposal{" "}
                                                        <CheckCircleIcon className="w-5 h-5 inline" />
                                                    </button>
                                                )}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
            <div className="overflow-x-auto bg-gradient-to-r from-slate-200 to-gray-100 shadow-md shadow-blue-200 rounded-lg p-4">
                <h2 className="font-semibold mb-2">Complete Disposal/s</h2>
                <table className="mb-3 w-full">
                    <thead className="text-center text-xs font-semibold border-t border-b border-lime-600">
                        <tr>
                            <th className="text-left py-2">Status</th>
                            <th className="text-left py-2">Date Submitted</th>
                            <th className="text-left py-2"># of Boxes</th>
                            <th className="text-left py-2">Submitted By</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recordsForDisposals.isLoading ? (
                            <tr>
                                <td colSpan={4}>
                                    <ComponentLoader />
                                </td>
                            </tr>
                        ) : (
                            recordsForDisposals.data &&
                            recordsForDisposals.data.disposal_archive.map(
                                (data) => {
                                    let sasd = "sad";

                                    return (
                                        <tr
                                            key={data.id}
                                            id={data.id}
                                            className="group cursor-pointer hover:bg-white transition-all ease-in-out duration-300"
                                        >
                                            <td className="py-2 text-left border-b border-slate-300">
                                                <div
                                                    className={`inline ${
                                                        data.status ===
                                                            "PENDING" &&
                                                        "bg-gray-500"
                                                    } ${
                                                        data.status ===
                                                            "APPROVED" &&
                                                        "bg-blue-500"
                                                    } ${
                                                        data.status ===
                                                            "DISPOSED" &&
                                                        "bg-red-500"
                                                    } text-white text-xs px-2 py-1 rounded-full`}
                                                >
                                                    {data.status}
                                                </div>
                                                <a
                                                    href={`/report/disposed-records-form/${data.id}`}
                                                    target="_blank"
                                                >
                                                    <div className="text-xs inline bg-green-500 text-green-800 rounded-full px-2 py-1 ml-2">
                                                        Click to view report
                                                    </div>
                                                </a>
                                            </td>
                                            <td className="py-2 text-left border-b border-slate-300">
                                                {formatDate(data.created_at)}
                                            </td>
                                            <td className="py-2 text-left border-b border-slate-300">
                                                {data.items.length}
                                            </td>
                                            <td className="py-2 text-left border-b border-slate-300">
                                                {data.user.profile.first_name}{" "}
                                                {data.user.profile.middle_name}{" "}
                                                {data.user.profile.last_name}
                                                {userType === "BRANCH_HEAD" &&
                                                    data.status ===
                                                        "PENDING" && (
                                                        <button
                                                            type="button"
                                                            className={`mx-1 float-right px-2 py-1 text-xs duration-300 rounded bg-green-700 text-white`}
                                                            onClick={() =>
                                                                approveSubmission(
                                                                    data.id
                                                                )
                                                            }
                                                        >
                                                            Approve{" "}
                                                            <CheckCircleIcon className="w-5 h-5 inline" />
                                                        </button>
                                                    )}
                                                {userType === "BRANCH_HEAD" &&
                                                    data.status ===
                                                        "APPROVED" && (
                                                        <button
                                                            type="button"
                                                            className={`mx-1 float-right px-2 py-1 text-xs duration-300 rounded bg-green-700 text-white`}
                                                            onClick={() =>
                                                                confirmBoxDisposal(
                                                                    data.id
                                                                )
                                                            }
                                                        >
                                                            Confirm Disposal{" "}
                                                            <CheckCircleIcon className="w-5 h-5 inline" />
                                                        </button>
                                                    )}
                                            </td>
                                        </tr>
                                    );
                                }
                            )
                        )}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
}
