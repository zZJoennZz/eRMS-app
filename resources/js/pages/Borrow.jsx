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
import {
    pending_borrows,
    process_borrow,
    receiveRc,
    returnDoc,
    declineBorrow,
} from "../utils/borrowFn";

import { toast } from "react-toastify";

import { AuthContext } from "../contexts/AuthContext";

import SideDrawer from "../components/SideDrawer";
import ComponentLoader from "../components/ComponentLoader";
import BorrowPill from "../components/BorrowPill";

const AddRDS = lazy(() => import("./RDS/AddRDS"));
const EditRDS = lazy(() => import("./RDS/EditRDS"));

import { ChevronRightIcon } from "@heroicons/react/24/solid";

import { formatDate } from "../utils/utilities";
import { API_URL } from "../configs/config";

export default function Borrow() {
    const { userType } = useContext(AuthContext);
    const queryClient = useQueryClient();
    const getAllPendingBorrows = useQuery({
        queryKey: ["allPendingBorrows"],
        queryFn: pending_borrows,
        retry: 2,
        networkMode: "always",
    });
    const [searchTxt, setSearchTxt] = useState("");
    const [remarks, setRemarks] = useState("");
    const [showDrawer, setShowDrawer] = useState(false);
    const [drawerTitle, setDrawerTitle] = useState("");
    const [selectedForm, setSelectedForm] = useState(<></>);
    const [rerender, setRerender] = useState(0);
    const [cart, setCart] = useState([]);

    const sideDrawerClose = useCallback(() => {
        setShowDrawer(false);
    });

    const processBorrow = useMutation({
        mutationFn: () => process_borrow(cart),
        onSuccess: () => {
            setCart([]);
            queryClient.invalidateQueries({ queryKey: ["allPendingBorrows"] });
            toast.success("Borrow request has been processed.");
        },
        onError: (err) => {
            toast.error(err.response.data.message);
        },
        networkMode: "always",
    });

    const processReturn = useMutation({
        mutationFn: (id) => returnDoc(id, { remarks }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["allPendingBorrows"] });
            toast.success("Return has been submitted.");
        },
        onError: (err) => {
            toast.error(err.response.data.message);
        },
        networkMode: "always",
    });

    const processReceiveRc = useMutation({
        mutationFn: (id) => receiveRc(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["allPendingBorrows"] });
            toast.success("Return has been submitted.");
        },
        onError: (err) => {
            toast.error(err.response.data.message);
        },
        networkMode: "always",
    });

    const processDeclineBorrow = useMutation({
        mutationFn: () => declineBorrow(cart),
        onSuccess: () => {
            setCart([]);
            queryClient.invalidateQueries({ queryKey: ["allPendingBorrows"] });
            toast.success("Borrow request has been declined.");
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
                    <AddRDS closeHandler={sideDrawerClose} />
                </Suspense>
            );
            setDrawerTitle("Add RDS");
            setShowDrawer(true);
        } else if (type === "edit") {
            setRerender((prev) => prev + 1);
            setSelectedForm(
                <Suspense fallback={<ComponentLoader />}>
                    <EditRDS
                        selRdsId={selRds}
                        closeHandler={sideDrawerClose}
                        rerender={rerender + 1}
                    />
                </Suspense>
            );
            setDrawerTitle("Edit RDS");
            setShowDrawer(true);
        } else {
            toast.error("Please refresh the page.");
        }
    }

    const toggleCart = (product) => {
        if (cart.some((item) => item.id === product.id)) {
            setCart(cart.filter((item) => item.id !== product.id));
        } else {
            setCart([...cart, product]);
        }
    };

    function beginProcessBorrow() {
        if (confirm("Are you sure to process this request?")) {
            processBorrow.mutate();
        }
    }

    function beginApproveBorrow() {
        if (confirm("Are you sure to approve this borrow?")) {
            processBorrow.mutate();
        }
    }

    function beginReceiveBorrow() {
        if (
            confirm(
                "You are confirming to receive this document. Are you sure?"
            )
        ) {
            processBorrow.mutate();
        }
    }

    function beginReceiveReturn(id) {
        if (
            confirm(
                "You are confirming to receive this document. Are you sure?"
            )
        ) {
            processReceiveRc.mutate(id);
        }
    }

    function confirmDeclineBorrow() {
        if (confirm("Are you sure to decline this borrow?")) {
            processDeclineBorrow.mutate();
        }
    }

    const isOlderThanTwoWeeks = (dateString) => {
        const givenDate = new Date(dateString);
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

        return givenDate < twoWeeksAgo;
    };

    async function returnBorrowed(id, dateToCompare) {
        if (isOlderThanTwoWeeks(dateToCompare)) {
            const justification = prompt(
                "You exceeded the 14 days/2 weeks. Please enter your justification below!"
            );
            setRemarks(justification);
            if (
                justification === "" ||
                justification === null ||
                justification === "N/A" ||
                justification === "n/a" ||
                justification === "0" ||
                justification == 0
            ) {
                alert("Invalid justification. Please try again.");
                return;
            }
        }
        if (confirm("Are you sure to return this document?")) {
            processReturn.mutate(id);
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
            {userType === "RECORDS_CUST" && (
                <>
                    <button
                        className={`bottom-6 left-6 bg-gradient-to-r from-gray-500 to-gray-500 text-white text-lg font-bold py-3 px-6 rounded-full ${
                            cart.length > 0 ? "fixed" : "hidden"
                        } shadow-lg hover:scale-110 transform transition-all duration-300 focus:outline-none animate-pulse`}
                        onClick={confirmDeclineBorrow}
                    >
                        Decline Borrow/s
                    </button>
                    <button
                        className={`bottom-6 right-6 bg-gradient-to-r from-pink-500 to-red-500 text-white text-lg font-bold py-3 px-6 rounded-full ${
                            cart.length > 0 ? "fixed" : "hidden"
                        } shadow-lg hover:scale-110 transform transition-all duration-300 focus:outline-none animate-pulse`}
                        onClick={beginProcessBorrow}
                    >
                        Process Borrow/s
                    </button>
                </>
            )}
            {userType === "BRANCH_HEAD" && (
                <>
                    <button
                        className={`bottom-6 left-6 bg-gradient-to-r from-gray-500 to-gray-500 text-white text-lg font-bold py-3 px-6 rounded-full ${
                            cart.length > 0 ? "fixed" : "hidden"
                        } shadow-lg hover:scale-110 transform transition-all duration-300 focus:outline-none animate-pulse`}
                        onClick={confirmDeclineBorrow}
                    >
                        Decline Borrow/s
                    </button>
                    <button
                        className={`bottom-6 right-6 bg-gradient-to-r from-pink-500 to-red-500 text-white text-lg font-bold py-3 px-6 rounded-full ${
                            cart.length > 0 ? "fixed" : "hidden"
                        } shadow-lg hover:scale-110 transform transition-all duration-300 focus:outline-none animate-pulse`}
                        onClick={beginApproveBorrow}
                    >
                        Approve Borrow/s
                    </button>
                </>
            )}
            {userType === "EMPLOYEE" && (
                <button
                    className={`bottom-6 right-6 bg-gradient-to-r from-pink-500 to-red-500 text-white text-lg font-bold py-3 px-6 rounded-full ${
                        cart.length > 0 ? "fixed" : "hidden"
                    } shadow-lg hover:scale-110 transform transition-all duration-300 focus:outline-none animate-pulse`}
                    onClick={beginReceiveBorrow}
                >
                    Receive Borrow/s
                </button>
            )}
            <h1 className="text-xl font-semibold mb-2">Borrows</h1>
            {/* <div className="mb-3">
                <input
                    type="text"
                    id="search"
                    name="search"
                    value={searchTxt}
                    onChange={(e) => setSearchTxt(e.target.value)}
                    className="w-full"
                    placeholder="Search borrow here"
                />
            </div> */}
            {/* <div className="mb-3">
                <button
                    className="px-4 py-2 rounded text-sm bg-lime-600 text-white hover:bg-lime-500 transition-all ease-in-out duration-300 flex items-center"
                    onClick={() => openDrawer("new")}
                >
                    <PlusIcon className="w-4 h-4 inline mr-2" /> Add RDS
                </button>
            </div> */}
            <div className="overflow-x-auto" id="borrows">
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
                        {getAllPendingBorrows.isLoading ? (
                            <tr>
                                <td colSpan={4}>
                                    <ComponentLoader />
                                </td>
                            </tr>
                        ) : (
                            getAllPendingBorrows.data &&
                            getAllPendingBorrows.data.map((data) => (
                                <tr
                                    key={data.id}
                                    id={data.id}
                                    className="group cursor-pointer hover:bg-gray-300 transition-all ease-in-out duration-300"
                                >
                                    <td className="py-2 text-left border-b border-slate-300">
                                        {((userType === "RECORDS_CUST" &&
                                            (data.status === "PENDING" ||
                                                data.status ===
                                                    "INIT_RETURN")) ||
                                            (userType === "BRANCH_HEAD" &&
                                                data.status === "PROCESSING") ||
                                            (userType === "EMPLOYEE" &&
                                                data.status ===
                                                    "RECEIVING")) && (
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
                                        )}
                                        {/* {data.children.length > 0 &&
                                            data.children[0].action} */}
                                    </td>
                                    <td className="py-2 text-left border-b border-slate-300">
                                        {data.document.description_of_document}{" "}
                                        <span className="text-xs text-slate-600">
                                            (From box #:{" "}
                                            {data.document.record.box_number})
                                        </span>
                                        <div>
                                            <BorrowPill status={data.status} />
                                            {data.status === "BORROWED" &&
                                                userType === "EMPLOYEE" && (
                                                    <button
                                                        className={`ml-1 px-2 py-1 shadow-md text-xs duration-300 rounded bg-cyan-600 text-white hover:bg-cyan-500`}
                                                        onClick={() =>
                                                            returnBorrowed(
                                                                data.id,
                                                                data.children[
                                                                    data
                                                                        .children
                                                                        .length -
                                                                        1
                                                                ].created_at
                                                            )
                                                        }
                                                    >
                                                        Return
                                                        <ChevronRightIcon className="ml-1 w-3 h-3 inline" />
                                                    </button>
                                                )}

                                            {data.status === "RETURNING" &&
                                                userType === "RECORDS_CUST" && (
                                                    <button
                                                        className={`ml-1 px-2 py-1 shadow-md text-xs duration-300 rounded bg-cyan-600 text-white hover:bg-cyan-500`}
                                                        onClick={() =>
                                                            beginReceiveReturn(
                                                                data.id
                                                            )
                                                        }
                                                    >
                                                        Receive
                                                        <ChevronRightIcon className="ml-1 w-3 h-3 inline" />
                                                    </button>
                                                )}
                                        </div>
                                    </td>
                                    <td className="py-2 text-left border-b border-slate-300">
                                        {data.action_by.profile.first_name +
                                            " " +
                                            data.action_by.profile.middle_name +
                                            " " +
                                            data.action_by.profile.last_name}
                                    </td>
                                    <td className="py-2 text-left border-b border-slate-300">
                                        {formatDate(data.created_at)}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
}
