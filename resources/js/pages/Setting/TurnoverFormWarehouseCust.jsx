import {
    CheckCircleIcon,
    XCircleIcon,
    ClipboardDocumentListIcon,
} from "@heroicons/react/24/solid";

import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { approveWhTurnover, declineTurnover } from "../../utils/turnoverFn";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import axios from "axios";

export default function TurnoverFormWarehouseCust({ turnoverData }) {
    const { userType } = useContext(AuthContext);
    const designation = turnoverData.designation_status || "";

    const queryClient = useQueryClient();

    const [newUser, setNewUser] = useState({
        username: "",
        email: "",
        password: "",
        first_name: "",
        middle_name: "",
        last_name: "",
    });

    function handleNewUserChange(e) {
        const { name, value } = e.target;
        setNewUser((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    const approveTurnoverRequest = useMutation({
        mutationFn: (data) => approveWhTurnover(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["checkTurnover"] });
            toast.success("Turnover request has been approved!");
            alert(
                "Here is the new username for the new record center custodian: " +
                    res.username +
                    ". Please inform them to log in with this username and the default password."
            );
        },
        onError: (err) => {
            toast.error(
                err.response?.data?.message || "Error approving turnover."
            );
        },
        networkMode: "always",
    });

    const declineTurnoverRequest = useMutation({
        mutationFn: () => declineTurnover(turnoverData.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["checkTurnover"] });
            toast.success("Turnover request has been declined!");
        },
        onError: (err) => {
            toast.error(err.response.data.message);
        },
        networkMode: "always",
    });

    function confirmApprove(e) {
        e.preventDefault();
        if (turnoverData.user) {
            if (confirm("Are you sure you want to approve this turnover?")) {
                approveTurnoverRequest.mutate({
                    id: turnoverData.id,
                    newUser,
                });
            }
        } else {
            if (
                confirm(
                    "Are you sure you want to approve this turnover and create a new Record Center Custodian?"
                )
            ) {
                approveTurnoverRequest.mutate({ id: turnoverData.id, newUser });
            }
        }
    }

    function confirmDecline(e) {
        e.preventDefault();

        if (confirm("Are you sure you want to decline this turnover?")) {
            declineTurnoverRequest.mutate();
        }
    }

    return (
        <div className="mx-auto p-6 bg-slate-200 text-slate-900 rounded-xl shadow-lg">
            <h1 className="text-2xl font-bold text-lime-600 flex items-center gap-2">
                <ClipboardDocumentListIcon className="w-6 h-6" /> Turnover
                Details{" "}
                <div className="inline text-sm font-normal bg-slate-600 text-white px-5 py-1 rounded-full">
                    <ArrowPathIcon className="inline w-4 h-4 mr-2" />
                    Pending
                </div>
            </h1>
            <form
                className="mt-6 space-y-5"
                method="POST"
                onSubmit={confirmApprove}
            >
                <div>
                    <label className="block text-sm font-medium text-lime-700">
                        Create user's account
                    </label>
                    <div className="space-y-3">
                        <input
                            type="text"
                            name="username"
                            placeholder="Employee ID"
                            value={newUser.username}
                            onChange={handleNewUserChange}
                            className="mt-2 w-full p-3 border border-gray-400 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-lime-500"
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={newUser.email}
                            onChange={handleNewUserChange}
                            className="w-full p-3 border border-gray-400 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-lime-500"
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={newUser.password}
                            onChange={handleNewUserChange}
                            className="w-full p-3 border border-gray-400 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-lime-500"
                            required
                        />
                        <input
                            type="text"
                            name="first_name"
                            placeholder="First Name"
                            value={newUser.first_name}
                            onChange={handleNewUserChange}
                            className="w-full p-3 border border-gray-400 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-lime-500"
                            required
                        />
                        <input
                            type="text"
                            name="middle_name"
                            placeholder="Middle Name"
                            value={newUser.middle_name}
                            onChange={handleNewUserChange}
                            className="w-full p-3 border border-gray-400 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-lime-500"
                        />
                        <input
                            type="text"
                            name="last_name"
                            placeholder="Last Name"
                            value={newUser.last_name}
                            onChange={handleNewUserChange}
                            className="w-full p-3 border border-gray-400 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-lime-500"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-lime-700">
                        Designation Status
                    </label>
                    <input
                        type="text"
                        value={designation}
                        readOnly
                        className="mt-2 w-full p-3 border border-gray-400 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-lime-500"
                    />
                </div>

                {designation === "PERMANENT" && (
                    <div>
                        <label className="block text-sm font-medium text-lime-700">
                            Assumption Date
                        </label>
                        <input
                            type="text"
                            value={turnoverData.assumption_date || "N/A"}
                            readOnly
                            className="mt-2 w-full p-3 border border-gray-400 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-lime-500"
                        />
                    </div>
                )}

                {designation === "TEMPORARY" && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-lime-700">
                                From Date
                            </label>
                            <input
                                type="text"
                                value={turnoverData.from_date || "N/A"}
                                readOnly
                                className="mt-2 w-full p-3 border border-gray-400 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-lime-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-lime-700">
                                To Date
                            </label>
                            <input
                                type="text"
                                value={turnoverData.to_date || "N/A"}
                                readOnly
                                className="mt-2 w-full p-3 border border-gray-400 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-lime-500"
                            />
                        </div>
                    </>
                )}

                {[
                    // {
                    //     label:
                    //         "Current " + userType === "RECORDS_CUST"
                    //             ? "Record Custodian ID"
                    //             : "Record Center Custodian ID",
                    //     value: turnoverData.current_job_holder_id,
                    // },
                    // {
                    //     label:
                    //         "Incoming " + userType === "RECORDS_CUST"
                    //             ? "Record Custodian ID"
                    //             : "Record Center Custodian ID",
                    //     value: turnoverData.incoming_job_holder_id,
                    // },
                    {
                        label: "Date of Submission",
                        value: new Date(
                            turnoverData.created_at
                        ).toLocaleString(),
                    },
                ].map((field, index) => (
                    <div key={index}>
                        <label className="block text-sm font-medium text-lime-700">
                            {field.label}
                        </label>
                        <input
                            type="text"
                            value={field.value || ""}
                            readOnly
                            className="mt-2 w-full p-3 border border-gray-400 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-lime-500"
                        />
                    </div>
                ))}

                <div>
                    <h2 className="text-lg font-semibold text-lime-600">
                        Items
                    </h2>
                    {turnoverData.items?.length > 0 ? (
                        <ul className="mt-3 space-y-3">
                            {turnoverData.items.map((item) => (
                                <li
                                    key={item.id}
                                    className="p-4 border border-gray-400 rounded-lg bg-white text-slate-900"
                                >
                                    <p>
                                        <strong>Box Number:</strong>{" "}
                                        {item.rds_record.box_number}
                                    </p>
                                    <p>
                                        <strong>Date Submitted:</strong>{" "}
                                        {new Date(
                                            item.rds_record.created_at
                                        ).toLocaleString()}
                                    </p>
                                    <p>
                                        <strong>Location:</strong> Record Center
                                    </p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-600">
                            No items available.
                        </p>
                    )}
                </div>

                <div className="my-4 text-sm italic">
                    By approving, the old record center custodian's account will
                    be deactivated immediately, and the role will automatically
                    be transferred to the new records custodian.
                </div>
                <button
                    type="submit"
                    className="mt-2 bg-lime-700 text-white px-4 py-2 rounded-full hover:bg-lime-600 transition-all ease-in-out"
                >
                    <CheckCircleIcon className="inline w-4 h-4" /> Approve
                </button>
                <button
                    type="button"
                    onClick={confirmDecline}
                    className="mt-2 ml-2 border-2 border-red-700 text-red-600 px-4 py-2 rounded-full transition-all ease-in-out hover:bg-red-700 hover:text-white"
                >
                    <XCircleIcon className="inline w-4 h-4" /> Decline
                </button>
            </form>
        </div>
    );
}
