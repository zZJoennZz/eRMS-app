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
} from "../utils/transactionFn";

import { toast } from "react-toastify";

import SideDrawer from "../components/SideDrawer";
import ComponentLoader from "../components/ComponentLoader";

const AddTransaction = lazy(() => import("./Transaction/AddTransaction"));
const EditRDS = lazy(() => import("./RDS/EditRDS"));

import { AuthContext } from "../contexts/AuthContext";

import { PlusIcon } from "@heroicons/react/24/solid";

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
    const [rerender, setRerender] = useState(0);

    const sideDrawerClose = useCallback(() => {
        setShowDrawer(false);
    });

    const approveTrans = useMutation({
        mutationFn: () => approveTransaction({ id: changeTransactionStatusId }),
        onSuccess: () => {
            setChangeTransactionStatusId(0);
            queryClient.invalidateQueries({ queryKey: ["allTransactions"] });
            toast.success("Transfer successfully approved!");
        },
        onError: (err) => {
            toast.error(err.response.data.message);
        },
        networkMode: "always",
    });

    const processTrans = useMutation({
        mutationFn: () => processTransaction({ id: changeTransactionStatusId }),
        onSuccess: () => {
            setChangeTransactionStatusId(0);
            queryClient.invalidateQueries({ queryKey: ["allTransactions"] });
            toast.success("Success! Transaction proceeds to next step!");
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
        if (confirm("Are you sure to approve this transfer?")) {
            setChangeTransactionStatusId(id);
            approveTrans.mutate();
            return 1;
        }
    }

    function startProcessTransaction(id) {
        if (confirm("Are you sure to start processing this transaction?")) {
            setChangeTransactionStatusId(id);
            processTrans.mutate();
            return 1;
        }
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
            <div className="mb-3">
                <button
                    className="px-4 py-2 rounded text-sm bg-lime-600 text-white hover:bg-lime-500 transition-all ease-in-out duration-300 flex items-center"
                    onClick={() => openDrawer("new")}
                >
                    <PlusIcon className="w-4 h-4 inline mr-2" /> Add Transaction
                </button>
            </div>
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
                                                    {data.type}
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
                                                            Process
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
                                                    data.type === "BORROW" &&
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
                                                    {rds.record.box_number} -{" "}
                                                    {rds.record.branch.name}
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
