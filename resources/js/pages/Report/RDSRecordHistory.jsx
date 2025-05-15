import React, { useEffect, useState } from "react";
import { json, useParams } from "react-router-dom";
import { API_URL } from "../../configs/config";
import { formatDate } from "../../utils/utilities";

export default function RDSRecordHistory() {
    const { id } = useParams();
    const [record, setRecord] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const source = axios.CancelToken.source();
        async function getRdsRecords() {
            await axios
                .get(`${API_URL}rds-record-history/${id}`, {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                    cancelToken: source.token,
                })
                .then((res) => {
                    let recordData = res.data.data;
                    setRecord(recordData);
                })
                .then(() => {
                    setIsLoading(false);
                })
                .catch((err) => {
                    if (axios.isCancel(err)) {
                        console.log("Request canceled");
                    } else {
                        console.log(err);
                    }
                });
        }
        getRdsRecords();

        return () => {
            source.cancel();
        };
    }, []);
    let rowCtr = 0;

    if (isLoading) return <>Loading...</>;

    const formatDate = (dateString) => new Date(dateString).toLocaleString();

    const statusText = {
        APPROVED: "Approved",
        PENDING: "Pending",
        REJECTED: "Rejected",
        DISPOSED: "Disposed",
        PENDING_DISPOSAL: "Submitted for Disposal",
    };

    const actionText = {
        SUBMIT: "Box Created",
        APPROVE: "Box Approved",
        DECLINE: "Box Declined",
        INITIATE_WITHDRAW: "Withdrawal Request Initiated",
        BRANCH_HEAD_APPROVE_WITHDRAW: "Business Unit Approved Withdrawal",
        WAREHOUSE_APPROVE_WITHDRAW: "Record Center Head Authorized Withdrawal",
        RECORD_CUST_RECEIVE: "BU Record Custodian Received Box",
        INITIATE_TRANSFER: "Transfer Request Initiated",
        BRANCH_HEAD_APPROVE_TRANSFER: "Business Unit Approved Transfer",
        WAREHOUSE_RECEIVE: "Record Center Custodian Received Box",
        DISPOSE: "Box Disposed",
        DECLINE_DISPOSAL: "Disposal Declined",
        SUBMIT_DISPOSAL: "Initiated Disposal",
        INIT_BORROW: "Initiated Borrow of",
        PROCESSING: "BU Record Custodian Approved Borrow of",
        BORROW_APPROVED: "Business Unit Approved Borrow of",
        BORROWED: "Borrowed Received",
        INIT_RETURN: "Initiated Return of",
        RETURNED: "Returned to BU Record Custodian",
        INIT_RELEASE: "Initiated Release of Box",
        RELEASE: "Approved Release of Box",
        BRANCH_HEAD_APPROVE_RELEASE: "Box Released",
        RETURN_RELEASE: "Box Returned from Release",
        AUTHORIZE_DISPOSE: "Authorized Disposal",
        APPROVE_DISPOSE: "Approved Disposal",
        WAREHOUSE_CUST_APPROVE_WITHDRAW: "Withdrawal Processed",
    };

    const mainHistory = [
        ...(record?.history || []).map((h) => ({
            action: actionText[h.action] || h.action,
            user: `${h?.user?.profile?.first_name || "Unknown"} ${
                h?.user?.profile?.last_name || ""
            }`,
            date: h.created_at,
        })),
        ...(record?.documents || []).flatMap((dc) => [
            ...(dc.history || []).map((dochis) => ({
                action:
                    dochis.action === "INIT_BORROW" ? actionText[dochis.action] +
                    ": " +
                    dc.description_of_document + ", Reason: " + dochis.remarks : dochis.action === "DECLINE"
            ? "Borrow Declined: " + dc.description_of_document
            : actionText[dochis.action] +
                  ": " +
                  dc.description_of_document ||
              dochis.action + ": " + dc.description_of_document,
    user: `${dochis?.action_by?.profile?.first_name || "Unknown"} ${
        dochis?.action_by?.profile?.last_name || ""
    }`
                ,
                date: dochis.created_at,
            })),
        ]),
        ...(record?.transactions || []).flatMap((tx) => [
            ...(tx.transaction?.history || []).map((h) => ({
                action:
                    h.action === "INIT_RELEASE"
                        ? actionText[h.action] + ": " + tx.transaction.remarks
                        : actionText[h.action] || h.action,
                user: `${h?.user?.profile?.first_name || "Unknown"} ${
                    h?.user?.profile?.last_name || ""
                }`,
                date: h.created_at,
            })),
        ]),
    ].sort((a, b) => new Date(a.date) - new Date(b.date));
    let histStl = false;
    return (
        <div className="p-6 bg-green-50 min-h-screen text-gray-900">
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
                <h1 className="text-2xl font-bold text-lime-700">
                    Box Details
                </h1>
                <p className="text-lg font-semibold text-gray-700">
                    Box Number: {record.box_number}
                </p>
                <p className="text-gray-600">
                    Status: {statusText[record.status] || record.status}
                </p>
                <p className="text-gray-600">
                    Submitted By: {record.submitted_by_user.profile.first_name}{" "}
                    {record.submitted_by_user.profile.last_name}
                </p>

                <h2 className="mt-6 text-xl font-bold text-lime-700">
                    Documents
                </h2>
                <ul className="mt-2 space-y-2">
                    {record.documents.map((doc) => (
                        <li
                            key={doc.id}
                            className="p-4 bg-lime-100 rounded-lg shadow"
                        >
                            <p className="font-semibold">
                                {doc.description_of_document}
                            </p>
                            <p className="text-gray-600">
                                Source: {doc.source_of_documents}
                            </p>
                            <p className="text-gray-600">
                                Period: {doc.period_covered_from} -{" "}
                                {doc.period_covered_to}
                            </p>
                        </li>
                    ))}
                </ul>

                <h2 className="mt-6 text-xl font-bold text-lime-700 mb-4">
                    History
                </h2>
                <div className="flex flex-col grid-cols-9 p-10 mx-auto md:grid bg-gradient-to-r from-lime-800 to-cyan-600 rounded-xl">
                    {mainHistory.map((entry, index) => {
                        if (
                            entry.action !== "TRANSFER" &&
                            entry.action !== "WITHDRAW"
                        ) {
                            histStl = !histStl;
                            return (
                                // <li
                                //     key={index}
                                //     className="p-4 bg-green-100 rounded-lg shadow"
                                // >
                                //     <div className="inline border border-gray-600 text-gray-600 px-2 py-1 text-sm rounded-full">
                                //         {">"} {entry.action}
                                //     </div>
                                //     <p className="text-gray-600 mt-4">
                                //         By: {entry.user}
                                //     </p>
                                //     <p className="text-gray-600">
                                //         Date: {formatDate(entry.date)}
                                //     </p>
                                // </li>
                                histStl ? (
                                    <div
                                        key={
                                            entry.date +
                                            entry.action +
                                            entry.user
                                        }
                                        className="flex md:contents flex-row-reverse"
                                    >
                                        <div className="relative p-4 my-6 text-gray-800 bg-white rounded-xl col-start-1 col-end-5 mr-auto md:mr-0 md:ml-auto">
                                            <h3 className="text-lg font-semibold lg:text-xl text-lime-700">
                                                {entry.action}
                                            </h3>
                                            <p className="mt-2 leading-6 text-sm">
                                                Action by: {entry.user}
                                            </p>
                                            <span className="absolute text-sm text-lime-100/75 -top-5 left-2 whitespace-nowrap">
                                                {formatDate(entry.date)}
                                            </span>
                                        </div>
                                        <div className="relative col-start-5 col-end-6 mr-7 md:mx-auto">
                                            <div className="flex items-center justify-center w-6 h-full">
                                                <div className="w-1 h-full bg-lime-300 rounded-t-full bg-gradient-to-b from-lime-400 to-lime-300"></div>
                                            </div>
                                            <div className="absolute w-6 h-6 -mt-3 bg-white border-4 border-lime-400 rounded-full top-1/2"></div>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        className="flex md:contents"
                                        key={
                                            entry.date +
                                            entry.action +
                                            entry.user
                                        }
                                    >
                                        <div className="relative col-start-5 col-end-6 mr-7 md:mx-auto">
                                            <div className="flex items-center justify-center w-6 h-full">
                                                <div className="w-1 h-full bg-lime-300"></div>
                                            </div>
                                            <div className="absolute w-6 h-6 -mt-3 bg-white border-4 border-lime-400 rounded-full top-1/2"></div>
                                        </div>
                                        <div className="relative p-4 my-6 text-gray-800 bg-white rounded-xl col-start-6 col-end-10 mr-auto">
                                            <h3 className="text-lg font-semibold lg:text-xl text-lime-700">
                                                {entry.action}
                                            </h3>
                                            <p className="mt-2 leading-6 text-sm">
                                                Action by: {entry.user}
                                            </p>
                                            <span className="absolute text-sm text-lime-100/75 -top-5 left-2 whitespace-nowrap">
                                                {formatDate(entry.date)}
                                            </span>
                                        </div>
                                    </div>
                                )
                            );
                        }
                    })}
                </div>
            </div>
        </div>
    );
}
