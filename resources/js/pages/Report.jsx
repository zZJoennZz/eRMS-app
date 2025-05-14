import React, { Suspense, useCallback, useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";

import DashboardLayout from "../components/DashboardLayout";
import Filter from "./Report/Filter";
import SideDrawer from "../components/SideDrawer";
import ComponentLoader from "../components/ComponentLoader";
import { toast } from "react-toastify";

export default function Report() {
    const { userType } = useContext(AuthContext);
    const [showDrawer, setShowDrawer] = useState(false);
    const [drawerTitle, setDrawerTitle] = useState("");
    const [selectedForm, setSelectedForm] = useState(<></>);

    function openDrawer(type) {
        if (type === "branchSummary") {
            setDrawerTitle("Records Summary Filter");
        } else if (type === "branchBoxes") {
            setDrawerTitle("Box Summary Filter");
        } else if (type === "disposedBoxSum") {
            setDrawerTitle("Disposed Box Summary Filter");
        } else if (type === "disposedRecordsSum") {
            setDrawerTitle("Disposed Records Summary Filter");
        } else if (type === "recordsByUser") {
            setDrawerTitle("Records by employee Filter");
        } else if (type === "borrowsAndReturns") {
            setDrawerTitle("Borrows and Returns Filter");
        } else if (type === "submittedDoc") {
            setDrawerTitle("Submitted Documents Filter");
        } else if (type === "warehouseSummary") {
            setDrawerTitle("Warehouse Summary Filter");
        } else if (type === "warehouseRecords") {
            setDrawerTitle("Records Summary Filter");
        } else if (type === "dueForDisposal") {
            setDrawerTitle("Due for Disposal");
        } else {
            toast.error("Please refresh the page.");
            return false;
        }
        setSelectedForm(
            <Suspense fallback={<ComponentLoader />}>
                <Filter type={type} closeHandler={sideDrawerClose} />
            </Suspense>
        );

        setShowDrawer(true);
    }

    const sideDrawerClose = useCallback(() => {
        setShowDrawer(false);
    });

    function openCurrentBorrowed() {
        window.location.href = `/print-branch-summary/${JSON.stringify({
            reportType: "currentBorrowed",
        })}`;
    }

    function openCurrentBorrows() {
        window.location.href = `/print-branch-summary/${JSON.stringify({
            reportType: "currentBorrows",
        })}`;
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
            <div className="p-5">
                <h1 className="text-xl font-bold text-slate-700 mb-5">
                    Reports
                </h1>
                {["RECORDS_CUST", "BRANCH_HEAD"].includes(userType) && (
                    <>
                        <div className="mb-3">
                            <div className="text-uppercase text-sm text-slate-500">
                                Summaries
                            </div>
                            <div>
                                <button
                                    onClick={() => openDrawer("branchBoxes")}
                                    className="block ml-2 text-green-700 hover:text-green-500"
                                >
                                    {">"} Boxes Summary
                                </button>
                            </div>
                            <div>
                                <button
                                    onClick={() => openDrawer("branchSummary")}
                                    className="block ml-2 text-green-700 hover:text-green-500"
                                >
                                    {">"} Records Summary
                                </button>
                            </div>
                            <div>
                                <button
                                    onClick={() => openDrawer("disposedBoxSum")}
                                    className="block ml-2 text-green-700 hover:text-green-500"
                                >
                                    {">"} Disposed Boxes Summary
                                </button>
                            </div>
                            <div>
                                <button
                                    onClick={() =>
                                        openDrawer("disposedRecordsSum")
                                    }
                                    className="block ml-2 text-green-700 hover:text-green-500"
                                >
                                    {">"} Disposed Records Summary
                                </button>
                            </div>
                        </div>
                        <div className="text-uppercase text-sm text-slate-500">
                            Records
                        </div>
                        <div>
                            <button
                                onClick={() => openDrawer("recordsByUser")}
                                className="block ml-2 text-green-700 hover:text-green-500"
                            >
                                {">"} Records by employee
                            </button>
                        </div>
                        <div>
                            <button
                                onClick={() => openDrawer("borrowsAndReturns")}
                                className="block ml-2 text-green-700 hover:text-green-500"
                            >
                                {">"} Borrows and returns
                            </button>
                        </div>
                        <div>
                            <button
                                onClick={openCurrentBorrowed.bind(this)}
                                className="block ml-2 text-green-700 hover:text-green-500"
                            >
                                {">"} Current borrowed documents
                            </button>
                        </div>
                    </>
                )}
                {["EMPLOYEE"].includes(userType) && (
                    <>
                        <div className="mb-3">
                            <div className="text-uppercase text-sm text-slate-500">
                                Records
                            </div>
                            <div>
                                <button
                                    onClick={() => openDrawer("submittedDoc")}
                                    className="block ml-2 text-green-700 hover:text-green-500"
                                >
                                    {">"} Submitted Documents
                                </button>
                            </div>
                            <div>
                                <button
                                    onClick={openCurrentBorrows.bind(this)}
                                    className="block ml-2 text-green-700 hover:text-green-500"
                                >
                                    {">"} Current Borrows
                                </button>
                            </div>
                        </div>
                    </>
                )}
                {["WAREHOUSE_CUST"].includes(userType) && (
                    <>
                        <div className="mb-3">
                            <div className="text-uppercase text-sm text-slate-500">
                                Summaries
                            </div>
                            <div>
                                <button
                                    onClick={() =>
                                        openDrawer("warehouseSummary")
                                    }
                                    className="block ml-2 text-green-700 hover:text-green-500"
                                >
                                    {">"} Records Center Summary
                                </button>
                            </div>
                            <div>
                                <button
                                    onClick={() =>
                                        openDrawer("warehouseRecords")
                                    }
                                    className="block ml-2 text-green-700 hover:text-green-500"
                                >
                                    {">"} Records Summary
                                </button>
                            </div>
                            <div>
                                <button
                                    onClick={() => openDrawer("dueForDisposal")}
                                    className="block ml-2 text-green-700 hover:text-green-500"
                                >
                                    {">"} Due for Disposal
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </DashboardLayout>
    );
}
