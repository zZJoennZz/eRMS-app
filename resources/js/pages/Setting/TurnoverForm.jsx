import {
    CheckCircleIcon,
    XCircleIcon,
    ClipboardDocumentListIcon,
} from "@heroicons/react/24/solid";

import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { approveTurnover } from "../../utils/turnoverFn";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export default function TurnoverForm({ turnoverData }) {
    const designation = turnoverData.designation_status || "";

    const queryClient = useQueryClient();

    const approveTurnoverRequest = useMutation({
        mutationFn: () => approveTurnover(turnoverData.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["checkTurnover"] });
            toast.success("Turnover request has been approved!");
            closeHandler();
        },
        onError: (err) => {
            toast.error(err.response.data.message);
        },
        networkMode: "always",
    });

    function confirmApprove(e) {
        e.preventDefault();
        if (confirm("Are you sure you want to approve this turnover?")) {
            approveTurnoverRequest.mutate();
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
                        Selected Employee
                    </label>
                    <input
                        type="text"
                        value={turnoverData.user?.username || ""}
                        readOnly
                        className="mt-2 w-full p-3 border border-gray-400 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-lime-500"
                    />
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
                    {
                        label: "Current Record Custodian ID",
                        value: turnoverData.current_job_holder_id,
                    },
                    {
                        label: "Incoming Record Custodian ID",
                        value: turnoverData.incoming_job_holder_id,
                    },
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
                                        <strong>Location:</strong> Branch
                                    </p>
                                    <p className="text-xs uppercase mt-3">
                                        Documents:
                                    </p>
                                    <ul className="pl-6 space-y-1 list-disc">
                                        {item.rds_record.documents.map(
                                            (doc) => (
                                                <li key={doc.id}>
                                                    {
                                                        doc.description_of_document
                                                    }
                                                </li>
                                            )
                                        )}
                                    </ul>
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
                    By approving, the old records custodian's account will be
                    deactivated immediately, and the role will automatically be
                    transferred to the new records custodian.
                </div>
                <button
                    type="submit"
                    className="mt-2 bg-lime-700 text-white px-4 py-2 rounded-full hover:bg-lime-600 transition-all ease-in-out"
                >
                    <CheckCircleIcon className="inline w-4 h-4" /> Approve
                </button>
                <button
                    type="button"
                    className="mt-2 ml-2 border-2 border-red-700 text-red-600 px-4 py-2 rounded-full transition-all ease-in-out hover:bg-red-700 hover:text-white"
                >
                    <XCircleIcon className="inline w-4 h-4" /> Decline
                </button>
            </form>
        </div>
    );
}
