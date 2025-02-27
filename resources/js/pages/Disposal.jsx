import React, {
    Suspense,
    lazy,
    useCallback,
    useContext,
    useState,
} from "react";

import axios from "axios";

import DashboardLayout from "../components/DashboardLayout";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { all, post, approve, confirmDispose } from "../utils/disposalFn";

import { toast } from "react-toastify";

import { AuthContext } from "../contexts/AuthContext";

import SideDrawer from "../components/SideDrawer";
import ComponentLoader from "../components/ComponentLoader";

import { CheckCircleIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

import { formatDate } from "../utils/utilities";
import { API_URL } from "../configs/config";

export default function Disposal() {
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
        mutationFn: () => post(cart),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["recordsForDisposals"],
            });
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
        },
        onError: (err) => {
            toast.error(err.response.data.message);
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
            <div className="text-xs mb-5">
                You can process the upcoming and overdue boxes at the same time.
            </div>
            <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-2 mb-5">
                <div className="overflow-x-auto bg-gradient-to-r from-lime-100 to-green-50 shadow-md shadow-blue-200 rounded-lg p-4">
                    <h2 className="font-semibold mb-2">Upcoming Disposal/s</h2>
                    <table className="mb-3 w-full">
                        <thead className="text-center text-xs font-semibold border-t border-b border-lime-600">
                            <tr>
                                <th></th>
                                <th className="text-left py-2">Box Number</th>
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
                                recordsForDisposals.data.upcoming.map(
                                    (data) => {
                                        let sasd = "sad";

                                        return (
                                            <tr
                                                key={data.id}
                                                id={data.id}
                                                className="group cursor-pointer hover:bg-white transition-all ease-in-out duration-300"
                                            >
                                                <td className="py-2 text-left border-b border-slate-300">
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
                                                </td>
                                                <td className="py-2 text-left border-b border-slate-300">
                                                    {data.box_number}
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
                                    }
                                )
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="overflow-x-auto bg-gradient-to-r from-pink-200 to-red-100 shadow-md shadow-blue-200 rounded-lg p-4">
                    <h2 className="font-semibold mb-2">Overdue Disposal/s</h2>
                    <table className="mb-3 w-full">
                        <thead className="text-center text-xs font-semibold border-t border-b border-lime-600">
                            <tr>
                                <th></th>
                                <th className="text-left py-2">RDS</th>
                                <th className="text-left py-2">Borrower</th>
                                <th className="text-left py-2">Date</th>
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
                                recordsForDisposals.data.overdue.map((data) => (
                                    <tr
                                        key={data.id}
                                        id={data.id}
                                        className="group cursor-pointer hover:bg-white transition-all ease-in-out duration-300"
                                    >
                                        <td className="py-2 text-left border-b border-slate-300">
                                            <button
                                                type="button"
                                                className={`mx-1 px-2 py-1 text-xs duration-300 rounded ${
                                                    cart.some(
                                                        (item) =>
                                                            item.id === data.id
                                                    )
                                                        ? "bg-green-500 text-white border border-green-500"
                                                        : "bg-green-700 text-white border border-green-700"
                                                }`}
                                                onClick={() => toggleCart(data)}
                                            >
                                                {cart.some(
                                                    (item) =>
                                                        item.id === data.id
                                                )
                                                    ? "-"
                                                    : "+"}
                                            </button>
                                        </td>
                                        <td className="py-2 text-left border-b border-slate-300">
                                            {data.box_number}
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
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
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
                                            <a
                                                href={`/report/disposed-records-form/${data.id}`}
                                                target="_blank"
                                            >
                                                <div className="group-hover:block hidden group-hover:absolute text-xs bg-opacity-40 bg-white px-2 py-1">
                                                    Click to view report
                                                </div>
                                            </a>
                                            <div
                                                className={`inline ${
                                                    data.status === "PENDING" &&
                                                    "bg-gray-500"
                                                } ${
                                                    data.status ===
                                                        "APPROVED" &&
                                                    "bg-blue-500"
                                                }  text-white text-xs px-2 py-1 rounded-full`}
                                            >
                                                {data.status}
                                            </div>
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
                                                <a
                                                    href={`/report/disposed-records-form/${data.id}`}
                                                    target="_blank"
                                                >
                                                    <div className="group-hover:block hidden group-hover:absolute text-xs bg-opacity-40 bg-white px-2 py-1">
                                                        Click to view report
                                                    </div>
                                                </a>
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
