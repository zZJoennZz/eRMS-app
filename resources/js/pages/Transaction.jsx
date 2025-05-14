import React, {
    Suspense,
    lazy,
    useCallback,
    useContext,
    useState,
} from "react";

import DashboardLayout from "../components/DashboardLayout";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    all,
    approveTransaction,
    processTransaction,
    declineTransaction,
    returnRelease,
} from "../utils/transactionFn";

import { toast } from "react-toastify";

import SideDrawer from "../components/SideDrawer";
import ComponentLoader from "../components/ComponentLoader";

const AddTransaction = lazy(() => import("./Transaction/AddTransaction"));
const EditRDS = lazy(() => import("./RDS/EditRDS"));

import { AuthContext } from "../contexts/AuthContext";

import { PlusIcon } from "@heroicons/react/24/solid";
import {
    ArrowTopRightOnSquareIcon,
    ChevronRightIcon,
} from "@heroicons/react/24/outline";

export default function Transaction() {
    const { userType } = useContext(AuthContext);
    const queryClient = useQueryClient();
    const getAllTransactions = useQuery({
        queryKey: ["allTransactions"],
        queryFn: all,
        retry: 2,
        networkMode: "always",
    });

    const [searchTxt, setSearchTxt] = useState("");
    const [showDrawer, setShowDrawer] = useState(false);
    const [drawerTitle, setDrawerTitle] = useState("");
    const [selectedForm, setSelectedForm] = useState(<></>);
    const [changeTransactionStatusId, setChangeTransactionStatusId] =
        useState(0);
    const [justification, setJustification] = useState("");
    const [rerender, setRerender] = useState(0);

    const sideDrawerClose = useCallback(() => {
        setShowDrawer(false);
    });

    const approveTrans = useMutation({
        mutationFn: () =>
            approveTransaction({
                id: changeTransactionStatusId,
                justification,
            }),
        onSuccess: () => {
            setChangeTransactionStatusId(0);
            setJustification("");
            queryClient.invalidateQueries({ queryKey: ["allTransactions"] });
            toast.success("Transaction successfully approved!");
        },
        onError: (err) => {
            toast.error(err.response.data.message);
        },
        networkMode: "always",
    });

    const beginReturnRelease = useMutation({
        mutationFn: () => returnRelease(changeTransactionStatusId),
        onSuccess: () => {
            setChangeTransactionStatusId(0);
            setJustification("");
            queryClient.invalidateQueries({ queryKey: ["allTransactions"] });
            toast.success("Released box successfully returned!");
        },
        onError: (err) => {
            toast.error(err.response.data.message);
        },
        networkMode: "always",
    });

    const processTrans = useMutation({
        mutationFn: () =>
            processTransaction({
                id: changeTransactionStatusId,
                remarks: justification,
            }),
        onSuccess: () => {
            setChangeTransactionStatusId(0);
            setJustification("");
            queryClient.invalidateQueries({ queryKey: ["allTransactions"] });
            toast.success("Success! Transaction proceeds to next step!");
        },
        onError: (err) => {
            toast.error(err.response.data.message);
        },
        networkMode: "always",
    });

    const declineTrans = useMutation({
        mutationFn: () =>
            declineTransaction({
                id: changeTransactionStatusId,
            }),
        onSuccess: () => {
            setChangeTransactionStatusId(0);
            setJustification("");
            queryClient.invalidateQueries({ queryKey: ["allTransactions"] });
            toast.success("Transaction successfully declined!");
        },
        onError: (err) => {
            toast.error(err.response.data.message);
        },
        networkMode: "always",
    });

    function openDrawer(type, selRds = 0) {
        if (type === "new") {
            setSelectedForm(
                <Suspense fallback={<ComponentLoader />}>
                    <AddTransaction closeHandler={sideDrawerClose} />
                </Suspense>
            );
            setDrawerTitle("Add Transaction");
            setShowDrawer(true);
        } else if (type === "edit") {
            // setRerender((prev) => prev + 1);
            // setSelectedForm(
            //     <Suspense fallback={<ComponentLoader />}>
            //         <EditRDS
            //             selRdsId={selRds}
            //             closeHandler={sideDrawerClose}
            //             rerender={rerender + 1}
            //         />
            //     </Suspense>
            // );
            // setDrawerTitle("Edit RDS");
            // setShowDrawer(true);
        } else {
            toast.error("Please refresh the page.");
        }
    }

    function confirmTransaction(id) {
        if (confirm("Are you sure to approve this transaction?")) {
            setChangeTransactionStatusId(id);
            approveTrans.mutate();
            return 1;
        }
    }

    function startProcessTransaction(id, type = "", dateDifference = 0) {
        if (confirm("Are you sure to start processing this transaction?")) {
            setChangeTransactionStatusId(id);
            if (type === "RETURN" && dateDifference < 14) {
                let remarks = prompt(
                    "Oh no! Your borrowed document/s exceeded 2 weeks or 14 days! Enter your justification below."
                );
                setJustification(remarks);
            }
            processTrans.mutate();
            return 1;
        }
    }

    function confirmDeclineTransaction(id) {
        if (confirm("Are you sure to decline this transaction?")) {
            setChangeTransactionStatusId(id);
            declineTrans.mutate();
            return 1;
        }
    }

    function confirmReturnRelease(id) {
        if (confirm("Confirming this box has been returned?")) {
            setChangeTransactionStatusId(id);
            beginReturnRelease.mutate();
            return 1;
        }
    }

    function getDateDifference(startDate) {
        let date1 = new Date(startDate);

        let Difference_In_Time = Date.now() - date1.getTime();

        let Difference_In_Days = Math.round(
            Difference_In_Time / (1000 * 3600 * 24)
        );

        return Difference_In_Days;
    }

    return (
        <DashboardLayout>
            <SideDrawer
                showDrawer={showDrawer}
                closeHandler={sideDrawerClose}
                title={drawerTitle}
                content={selectedForm}
                twcssWidthClass="w-96"
            />
            <h1 className="text-xl font-semibold mb-2">Transactions</h1>
            <div className="mb-3">
                <input
                    type="text"
                    id="search"
                    name="search"
                    value={searchTxt}
                    onChange={(e) => setSearchTxt(e.target.value)}
                    className="w-full"
                    placeholder="Search Transaction here"
                />
            </div>
            {userType === "RECORDS_CUST" && (
                <div className="mb-3">
                    <button
                        className="px-4 py-2 rounded text-sm bg-lime-600 text-white hover:bg-lime-500 transition-all ease-in-out duration-300 flex items-center"
                        onClick={() => openDrawer("new")}
                    >
                        <PlusIcon className="w-4 h-4 inline mr-2" /> Add
                        Transaction
                    </button>
                </div>
            )}
            <div className="overflow-x-auto">
                <table className="mb-3 w-full">
                    <thead className="text-center text-xs font-semibold border-t border-b border-lime-600">
                        <tr>
                            <th className="text-left py-2">Type</th>
                            <th className="text-left py-2">Box Number</th>
                            <th className="text-center py-2">
                                Transaction Date
                            </th>
                            <th className="text-right py-2">Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {getAllTransactions.isLoading ? (
                            <tr>
                                <td colSpan={3}>
                                    <ComponentLoader />
                                </td>
                            </tr>
                        ) : (
                            getAllTransactions.data &&
                            getAllTransactions.data
                                .filter((i) =>
                                    Object.values(i).some((value) =>
                                        value
                                            ?.toString()
                                            .toLowerCase()
                                            .includes(searchTxt.toLowerCase())
                                    )
                                )
                                .map((data) => (
                                    <>
                                        <tr
                                            key={data.id}
                                            id={data.id}
                                            className="group cursor-pointer hover:bg-gray-300 transition-all ease-in-out duration-300"
                                        >
                                            <td
                                                colSpan={2}
                                                className="py-2 text-left border-b border-slate-300"
                                            >
                                                <div className="bg-slate-700 mr-2 text-white rounded-full inline-block px-2 py-1 text-xs">
                                                    {data.type ===
                                                    "RELEASE_RETURNED"
                                                        ? "RELEASE RETURNED"
                                                        : data.type}
                                                </div>
                                                {(data.status === "PENDING" ||
                                                    data.status ===
                                                        "PROCESSING") && (
                                                    <div className="bg-slate-400 text-white rounded-full inline-block px-2 py-1 text-xs">
                                                        {data.status}
                                                    </div>
                                                )}
                                                {data.status ===
                                                    "FOR RECEIVING" && (
                                                    <div className="bg-orange-400 text-white rounded-full inline-block px-2 py-1 text-xs">
                                                        {data.status}
                                                    </div>
                                                )}
                                                {data.status === "APPROVED" && (
                                                    <div className="bg-green-700 text-white rounded-full inline-block px-2 py-1 text-xs">
                                                        {data.status}
                                                    </div>
                                                )}
                                                {data.status === "DECLINED" && (
                                                    <div className="bg-red-700 text-white rounded-full inline-block px-2 py-1 text-xs">
                                                        {data.status}
                                                    </div>
                                                )}
                                                {data.status === "FOR WH APPROVAL" && (
                                                    <div className="bg-pink-700 text-white rounded-full inline-block px-2 py-1 text-xs">
                                                        FOR AUTHORIZATION
                                                    </div>
                                                )}
                                                {(userType === "BRANCH_HEAD" ||
                                                    userType === "DEV") &&
                                                    (data.type === "TRANSFER" ||
                                                        data.type ===
                                                            "WITHDRAW") &&
                                                    data.status ===
                                                        "PENDING" && (
                                                        <button
                                                            type="button"
                                                            className="opacity-0 group-focus:opacity-100 group-hover:opacity-100 ml-2 bg-white text-green-700 border border-green-700 px-2 py-1 text-xs transition-all ease-in-out duration-300 rounded"
                                                            onClick={() =>
                                                                startProcessTransaction(
                                                                    data.id
                                                                )
                                                            }
                                                        >
                                                            Approve
                                                        </button>
                                                    )}

                                                {(userType ===
                                                    "WAREHOUSE_CUST" ||
                                                    userType === "DEV") &&
                                                    data.type === "WITHDRAW" &&
                                                    data.status ===
                                                        "PROCESSING" && (
                                                        <button
                                                            type="button"
                                                            className="opacity-0 group-focus:opacity-100 group-hover:opacity-100 ml-2 bg-white text-green-700 border border-green-700 px-2 py-1 text-xs transition-all ease-in-out duration-300 rounded"
                                                            onClick={() =>
                                                                startProcessTransaction(
                                                                    data.id
                                                                )
                                                            }
                                                        >
                                                            Process
                                                        </button>
                                                    )}
                                                {userType ===
                                                    "WAREHOUSE_CUST" &&
                                                    data.type === "TRANSFER" &&
                                                    data.status ===
                                                        "PROCESSING" && (
                                                        <button
                                                            type="button"
                                                            className="opacity-0 group-focus:opacity-100 group-hover:opacity-100 ml-2 bg-white text-green-700 border border-green-700 px-2 py-1 text-xs transition-all ease-in-out duration-300 rounded"
                                                            onClick={() =>
                                                                confirmTransaction(
                                                                    data.id
                                                                )
                                                            }
                                                        >
                                                            Approve
                                                        </button>
                                                    )}
                                                {userType === "RECORDS_CUST" &&
                                                    data.type === "WITHDRAW" &&
                                                    data.status ===
                                                        "FOR RECEIVING" && (
                                                        <button
                                                            type="button"
                                                            className="opacity-0 group-focus:opacity-100 group-hover:opacity-100 ml-2 bg-white text-green-700 border border-green-700 px-2 py-1 text-xs transition-all ease-in-out duration-300 rounded"
                                                            onClick={() =>
                                                                confirmTransaction(
                                                                    data.id
                                                                )
                                                            }
                                                        >
                                                            Receive
                                                        </button>
                                                    )}
                                                {userType === "RECORDS_CUST" &&
                                                    data.type === "BORROW" &&
                                                    data.status ===
                                                        "PENDING" && (
                                                        <button
                                                            type="button"
                                                            className="opacity-0 group-focus:opacity-100 group-hover:opacity-100 ml-2 bg-white text-green-700 border border-green-700 px-2 py-1 text-xs transition-all ease-in-out duration-300 rounded"
                                                            onClick={() =>
                                                                startProcessTransaction(
                                                                    data.id
                                                                )
                                                            }
                                                        >
                                                            Process
                                                        </button>
                                                    )}
                                                {userType === "BRANCH_HEAD" &&
                                                    data.type === "RELEASE" &&
                                                    data.status ===
                                                        "PENDING" && (
                                                        <button
                                                            type="button"
                                                            className="opacity-0 group-focus:opacity-100 group-hover:opacity-100 ml-2 bg-white text-green-700 border border-green-700 px-2 py-1 text-xs transition-all ease-in-out duration-300 rounded"
                                                            onClick={() =>
                                                                confirmTransaction(
                                                                    data.id
                                                                )
                                                            }
                                                        >
                                                            Approve
                                                        </button>
                                                    )}
                                                {userType === "EMPLOYEE" &&
                                                    data.type === "BORROW" &&
                                                    data.status ===
                                                        "FOR RECEIVING" && (
                                                        <button
                                                            type="button"
                                                            className="opacity-0 group-focus:opacity-100 group-hover:opacity-100 ml-2 bg-white text-green-700 border border-green-700 px-2 py-1 text-xs transition-all ease-in-out duration-300 rounded"
                                                            onClick={() =>
                                                                confirmTransaction(
                                                                    data.id
                                                                )
                                                            }
                                                        >
                                                            Receive
                                                        </button>
                                                    )}

                                                {userType === "EMPLOYEE" &&
                                                    data.type === "BORROW" &&
                                                    data.history[
                                                        data.history.length - 1
                                                    ].action !== "RETURNED" &&
                                                    data.status ===
                                                        "APPROVED" && (
                                                        <button
                                                            type="button"
                                                            className="opacity-0 group-focus:opacity-100 group-hover:opacity-100 ml-2 bg-white text-green-700 border border-green-700 px-2 py-1 text-xs transition-all ease-in-out duration-300 rounded"
                                                            onClick={() =>
                                                                startProcessTransaction(
                                                                    data.id,
                                                                    "RETURN",
                                                                    getDateDifference(
                                                                        data.transaction_date
                                                                    )
                                                                )
                                                            }
                                                        >
                                                            Return
                                                        </button>
                                                    )}

                                                {userType === "WAREHOUSE_HEAD" &&
                                                    data.type === "WITHDRAW" &&
                                                    data.status ===
                                                        "FOR WH APPROVAL" && (
                                                        <button
                                                            type="button"
                                                            className="opacity-0 group-focus:opacity-100 group-hover:opacity-100 ml-2 bg-white text-green-700 border border-green-700 px-2 py-1 text-xs transition-all ease-in-out duration-300 rounded"
                                                            onClick={() =>
                                                                startProcessTransaction(
                                                                    data.id
                                                                )
                                                            }
                                                        >
                                                            Authorize
                                                        </button>
                                                    )}

                                                {userType === "RECORDS_CUST" &&
                                                    data.type === "RETURN" &&
                                                    data.status ===
                                                        "PENDING" && (
                                                        <button
                                                            type="button"
                                                            className="opacity-0 group-focus:opacity-100 group-hover:opacity-100 ml-2 bg-white text-green-700 border border-green-700 px-2 py-1 text-xs transition-all ease-in-out duration-300 rounded"
                                                            onClick={() =>
                                                                confirmTransaction(
                                                                    data.id
                                                                )
                                                            }
                                                        >
                                                            Approve
                                                        </button>
                                                    )}

                                                {userType === "BRANCH_HEAD" &&
                                                    data.status === "PENDING" &&
                                                    (data.type === "WITHDRAW" ||
                                                        data.type ===
                                                            "TRANSFER") && (
                                                        <button
                                                            type="button"
                                                            className="opacity-0 group-focus:opacity-100 group-hover:opacity-100 ml-2 bg-white text-red-700 border border-red-700 px-2 py-1 text-xs transition-all ease-in-out duration-300 rounded"
                                                            onClick={() =>
                                                                confirmDeclineTransaction(
                                                                    data.id
                                                                )
                                                            }
                                                        >
                                                            Decline
                                                        </button>
                                                    )}
                                                {userType ===
                                                    "WAREHOUSE_CUST" &&
                                                    data.status ===
                                                        "PROCESSING" &&
                                                    (data.type === "TRANSFER" ||
                                                        data.type ===
                                                            "WITHDRAW") && (
                                                        <button
                                                            type="button"
                                                            className="opacity-0 group-focus:opacity-100 group-hover:opacity-100 ml-2 bg-white text-red-700 border border-red-700 px-2 py-1 text-xs transition-all ease-in-out duration-300 rounded"
                                                            onClick={() =>
                                                                confirmDeclineTransaction(
                                                                    data.id
                                                                )
                                                            }
                                                        >
                                                            Decline
                                                        </button>
                                                    )}

                                                {data.rds_records[0].record
                                                    .latest_history.action ===
                                                    "RELEASE" && (
                                                    <button
                                                        className={`ml-1 px-2 py-1 shadow-md text-xs duration-300 rounded bg-cyan-600 text-white hover:bg-cyan-500`}
                                                        onClick={() =>
                                                            confirmReturnRelease(
                                                                data.id
                                                            )
                                                        }
                                                    >
                                                        Return
                                                        <ChevronRightIcon className="ml-1 w-3 h-3 inline" />
                                                    </button>
                                                )}
                                            </td>
                                            <td className="py-2 text-center border-b border-slate-300">
                                                {data.transaction_date}
                                            </td>
                                            <td className="py-2 text-right border-b border-slate-300">
                                                {data.remarks}
                                            </td>
                                        </tr>
                                        {data.rds_records.map((rds) => (
                                            <tr
                                                id={"rds" + rds.id}
                                                key={rds.id}
                                            >
                                                <td className="py-2 text-left border-b border-slate-300"></td>
                                                <td
                                                    className="py-2 text-left border-b border-slate-300"
                                                    colSpan={3}
                                                >
                                                    {(userType !==
                                                    "WAREHOUSE_CUST" && userType !==
                                                    "WAREHOUSE_HEAD") ? (
                                                        <a
                                                            href={`/rds-record-history/${rds.record.id}`}
                                                            target="_blank"
                                                            className="text-lime-700 hover:text-lime-500 transition-all ease-in-out duration-300"
                                                        >
                                                            {
                                                                rds.record
                                                                    .box_number
                                                            }{" "}
                                                            -{" "}
                                                            {
                                                                rds.record
                                                                    .branch.name
                                                            }
                                                            <ArrowTopRightOnSquareIcon className="w-4 h-4 inline ml-1" />
                                                        </a>
                                                    ) : (
                                                        <>
                                                            {
                                                                rds.record
                                                                    .box_number
                                                            }{" "}
                                                            -{" "}
                                                            {
                                                                rds.record
                                                                    .branch.name
                                                            }
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </>
                                ))
                        )}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
}
