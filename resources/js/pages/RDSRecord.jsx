import React, {
    Suspense,
    lazy,
    useCallback,
    useContext,
    useState,
} from "react";

import DashboardLayout from "../components/DashboardLayout";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { all, approveRdsRecord } from "../utils/rdsRecordFn";

import { toast } from "react-toastify";

import SideDrawer from "../components/SideDrawer";
import ComponentLoader from "../components/ComponentLoader";

const AddRDSRecord = lazy(() => import("./RDSRecord/AddRDSRecord"));
// const EditRDS = lazy(() => import("./RDS/EditRDS"));

import { PlusIcon } from "@heroicons/react/24/solid";

import { AuthContext } from "../contexts/AuthContext";

export default function RDSRecord() {
    const { userType } = useContext(AuthContext);
    const queryClient = useQueryClient();
    const getAllRdsRecords = useQuery({
        queryKey: ["allRdsRecords"],
        queryFn: all,
        retry: 2,
        networkMode: "always",
    });
    const [searchTxt, setSearchTxt] = useState("");
    const [showDrawer, setShowDrawer] = useState(false);
    const [drawerTitle, setDrawerTitle] = useState("");
    const [selectedForm, setSelectedForm] = useState(<></>);
    const [selectedRdsRecord, setSelectedRdsRecord] = useState(0);
    const [rerender, setRerender] = useState(0);

    const sideDrawerClose = useCallback(() => {
        setShowDrawer(false);
    });

    const approveRecord = useMutation({
        mutationFn: () => approveRdsRecord({ id: selectedRdsRecord }),
        onSuccess: () => {
            setSelectedRdsRecord(0);
            queryClient.invalidateQueries({ queryKey: ["allRdsRecord"] });
            toast.success("RDS Record successfully approved!");
        },
        onError: (err) => {
            toast.error(err.response.data.message);
        },
        networkMode: "always",
    });

    function approveSelectedRecord(id) {
        if (confirm("Are you sure to approve this record?")) {
            setSelectedRdsRecord(id);
            approveRecord.mutate();
            return 1;
        }
    }

    function openDrawer(type, selRdsRecord = 0) {
        if (type === "new") {
            setSelectedForm(
                <Suspense fallback={<ComponentLoader />}>
                    <AddRDSRecord closeHandler={sideDrawerClose} />
                </Suspense>
            );
            setDrawerTitle("Add RDS Record");
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
            setDrawerTitle("Edit RDS Records");
            setShowDrawer(true);
        } else {
            toast.error("Please refresh the page.");
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
            <h1 className="text-xl font-semibold mb-2">RDS Record</h1>
            <div className="mb-3">
                <input
                    type="text"
                    id="search"
                    name="search"
                    value={searchTxt}
                    onChange={(e) => setSearchTxt(e.target.value)}
                    className="w-full"
                    placeholder="Search RDS Record here"
                />
            </div>
            <div className="mb-3">
                <button
                    className="px-4 py-2 rounded text-sm bg-lime-600 text-white hover:bg-lime-500 transition-all ease-in-out duration-300 flex items-center"
                    onClick={() => openDrawer("new")}
                >
                    <PlusIcon className="w-4 h-4 inline mr-2" /> Add RDS Record
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="mb-3 w-full">
                    <thead className="text-center text-xs font-semibold border-t border-b border-lime-600">
                        <tr>
                            <th className="text-left py-2" rowSpan={2}>
                                Box Number
                            </th>
                            <th className="py-2 text-left" rowSpan={2}>
                                RDS Item Number
                            </th>
                            <th className="text-left py-2" rowSpan={2}>
                                Source of Documents
                            </th>
                            <th className="text-left py-2" rowSpan={2}>
                                Description of Document
                            </th>
                            <th className="text-left py-2" rowSpan={2}>
                                Period Covered
                            </th>
                            <th className="text-center py-2" colSpan={4}>
                                Retention Period (Per E.O. No. 095 Series of
                                2016)
                            </th>
                            <th className="text-right py-2" rowSpan={2}>
                                Projected Date of Disposal
                            </th>
                            <th className="text-right py-2" rowSpan={2}>
                                Location
                            </th>
                            <th className="text-right py-2" rowSpan={2}>
                                Remarks
                            </th>
                        </tr>
                        <tr>
                            <th>Active</th>
                            <th>Storage</th>
                            <th>Total</th>
                            <th>Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {getAllRdsRecords.isLoading ? (
                            <tr>
                                <td colSpan={6}>
                                    <ComponentLoader />
                                </td>
                            </tr>
                        ) : (
                            getAllRdsRecords.data &&
                            getAllRdsRecords.data
                                .filter((i) =>
                                    i.box_number
                                        .toLowerCase()
                                        .includes(searchTxt.toLowerCase())
                                )
                                .map((data) => (
                                    <tr
                                        key={data.id}
                                        id={data.id}
                                        className="group cursor-pointer hover:bg-gray-300 transition-all ease-in-out duration-300"
                                    >
                                        <td className="py-2 text-left border-b border-slate-300">
                                            {data.box_number}
                                            {/* <button
                                                type="button"
                                                className="opacity-0 group-focus:opacity-100 group-hover:opacity-100 ml-2 bg-white text-gray-400 border border-gray-400 px-2 py-1 text-xs transition-all ease-in-out duration-300 rounded"
                                                onClick={() =>
                                                    openDrawer("edit", data.id)
                                                }
                                            >
                                                Edit
                                            </button> */}
                                            {data.status === "PENDING" && (
                                                <div className="bg-gray-500 text-xs inline text-white p-0.5 rounded-full ml-1">
                                                    Pending
                                                </div>
                                            )}
                                            {data.status === "PENDING" &&
                                                userType === "RECORDS_CUST" && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            approveSelectedRecord(
                                                                data.id
                                                            )
                                                        }
                                                        className="opacity-0 group-focus:opacity-100 group-hover:opacity-100 ml-2 bg-white text-green-700 border border-green-700 px-2 py-1 text-xs transition-all ease-in-out duration-300 rounded"
                                                    >
                                                        Approve
                                                    </button>
                                                )}

                                            {data.status === "APPROVED" && (
                                                <a
                                                    href={`/print/${data.id}`}
                                                    target="_blank"
                                                    className="opacity-0 group-focus:opacity-100 group-hover:opacity-100 ml-2 bg-white text-blue-700 border border-blue-700 px-2 py-1 text-xs transition-all ease-in-out duration-300 rounded"
                                                >
                                                    Print
                                                </a>
                                            )}
                                        </td>
                                        <td className="py-2 border-b border-slate-300">
                                            {data.rds.item_number}
                                        </td>
                                        <td className="py-2 border-b border-slate-300">
                                            {data.source_of_documents}
                                        </td>
                                        <td className="py-2 border-b border-slate-300">
                                            {data.description_of_document}
                                        </td>
                                        <td className="py-2 text-left border-b border-slate-300">
                                            {data.period_covered_from} -{" "}
                                            {data.period_covered_to}
                                        </td>
                                        <td className="py-2 text-center border-b border-slate-300">
                                            {data.rds.active}
                                        </td>
                                        <td className="py-2 text-center border-b border-slate-300">
                                            {data.rds.storage}
                                        </td>
                                        <td className="py-2 text-center border-b border-slate-300">
                                            {data.rds.active + data.rds.storage}
                                        </td>
                                        <td className="py-2 text-center border-b border-slate-300">
                                            {data.rds.remarks}
                                        </td>
                                        <td className="py-2 text-center border-b border-slate-300">
                                            {data.projected_date_of_disposal}
                                        </td>
                                        <td className="py-2 text-center border-b border-slate-300">
                                            {data.history[0].location}
                                        </td>
                                        <td className="py-2 text-center border-b border-slate-300">
                                            {data.remarks}
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
