import React, {
    Suspense,
    lazy,
    useCallback,
    useContext,
    useState,
} from "react";

import DashboardLayout from "../components/DashboardLayout";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { all, approveRdsRecord, declineRdsRecord } from "../utils/rdsRecordFn";
import { borrow } from "../utils/borrowFn";

import { toast } from "react-toastify";

import SideDrawer from "../components/SideDrawer";
import ComponentLoader from "../components/ComponentLoader";

const AddRDSRecord = lazy(() => import("./RDSRecord/AddRDSRecord"));
const EditRDSRecord = lazy(() => import("./RDSRecord/EditRDSRecord"));

import {
    PlusIcon,
    ArrowPathRoundedSquareIcon,
    FolderOpenIcon,
} from "@heroicons/react/24/solid";

import { AuthContext } from "../contexts/AuthContext";

export default function RDSRecord() {
    const [recordTypeFilter, setRecordTypeFilter] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    const { userType, currId } = useContext(AuthContext);
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
    const [cart, setCart] = useState([]);

    const sideDrawerClose = useCallback(() => {
        setShowDrawer(false);
    });

    const approveRecord = useMutation({
        mutationFn: () => approveRdsRecord({ id: selectedRdsRecord }),
        onSuccess: () => {
            setSelectedRdsRecord(0);
            queryClient.invalidateQueries({ queryKey: ["allRdsRecords"] });
            toast.success("RDS Record successfully approved!");
        },
        onError: (err) => {
            toast.error(err.response.data.message);
        },
        networkMode: "always",
    });

    const borrowDocs = useMutation({
        mutationFn: () => borrow(cart),
        onSuccess: () => {
            setCart([]);
            queryClient.invalidateQueries({ queryKey: ["allRdsRecords"] });
            toast.success("Document borrow request successfully submitted.");
        },
        onError: (err) => {
            toast.error(err.response.data.message);
        },
        networkMode: "always",
    });

    const declineRecord = useMutation({
        mutationFn: () => declineRdsRecord({ id: selectedRdsRecord }),
        onSuccess: () => {
            setSelectedRdsRecord(0);
            queryClient.invalidateQueries({ queryKey: ["allRdsRecords"] });
            toast.success("RDS Record successfully declined!");
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

    function confirmDeclineRecord(id) {
        if (confirm("Are you sure to decline this record?")) {
            setSelectedRdsRecord(id);
            declineRecord.mutate();
            return 1;
        }
    }

    const toggleCart = (product) => {
        if (cart.some((item) => item.id === product.id)) {
            setCart(cart.filter((item) => item.id !== product.id));
        } else {
            setCart([...cart, product]);
        }
    };

    function submitBorrow() {
        if (confirm("Are you sure to borrow these item/s?")) {
            borrowDocs.mutate();
        }
    }

    function openDrawer(type, record = null) {
        if (type === "new") {
            setSelectedForm(
                <Suspense fallback={<ComponentLoader />}>
                    <AddRDSRecord closeHandler={sideDrawerClose} />
                </Suspense>
            );
            setDrawerTitle("Add Record");
            setShowDrawer(true);
        } else if (type === "edit" && record) {
            setSelectedForm(
                <Suspense fallback={<ComponentLoader />}>
                    <EditRDSRecord
                        closeHandler={sideDrawerClose}
                        record={record}
                    />
                </Suspense>
            );
            setDrawerTitle("Edit Record");
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
                twcssWidthClass="w-full"
            />
            <button
                className={`bottom-6 right-6 bg-gradient-to-r from-pink-500 to-red-500 text-white text-lg font-bold py-3 px-6 rounded-full ${
                    cart.length > 0 ? "fixed" : "hidden"
                } shadow-lg hover:scale-110 transform transition-all duration-300 focus:outline-none animate-pulse`}
                onClick={submitBorrow}
            >
                Borrow Record/s
            </button>
            <h1 className="text-xl font-semibold mb-2"> Records</h1>
            {/* <div className="mb-3">
                <input
                    type="text"
                    id="search"
                    name="search"
                    value={searchTxt}
                    onChange={(e) => setSearchTxt(e.target.value)}
                    className="w-full"
                    placeholder="Search RDS Record here"
                />
            </div> */}
            <div className="mb-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                    type="text"
                    value={searchTxt}
                    onChange={(e) => setSearchTxt(e.target.value)}
                    className="w-full"
                    placeholder="Search RDS Record here"
                />

                <select
                    value={recordTypeFilter}
                    onChange={(e) => setRecordTypeFilter(e.target.value)}
                    className="w-full"
                >
                    <option value="">All Record Types</option>
                    <option value="APPROVED">Approved</option>
                    <option value="PENDING">Pending</option>
                    <option value="DECLINED">Declined</option>
                    <option value="DISPOSED">Disposed</option>
                    <option value="RELEASED">Released</option>
                </select>

                <div className="flex gap-2">
                    <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="w-full"
                    />
                    <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="w-full"
                    />
                </div>
            </div>

            {userType !== "RECORDS_CUST" && userType !== "BRANCH_HEAD" && (
                <div className="mb-3">
                    <button
                        className="px-4 py-2 rounded text-sm bg-lime-600 text-white hover:bg-lime-500 transition-all ease-in-out duration-300 flex items-center"
                        onClick={() => openDrawer("new")}
                    >
                        <PlusIcon className="w-4 h-4 inline mr-2" /> Add Record
                    </button>
                </div>
            )}

            {(userType === "RECORDS_CUST" ||
                userType === "BRANCH_HEAD" ||
                userType === "EMPLOYEE") && (
                <div className="mb-3">
                    <a
                        href="/borrows"
                        className="px-4 py-2 rounded text-sm bg-lime-600 text-white hover:bg-lime-500 transition-all ease-in-out duration-300 inline items-center"
                    >
                        <ArrowPathRoundedSquareIcon className="w-4 h-4 inline mr-2" />{" "}
                        Borrow & Return
                    </a>
                    {userType === "RECORDS_CUST" && (
                        <a
                            href="/open-box"
                            className="ml-3 px-4 py-2 rounded text-sm bg-lime-600 text-white hover:bg-lime-500 transition-all ease-in-out duration-300 inline items-center"
                        >
                            <FolderOpenIcon className="w-4 h-4 inline mr-2" />{" "}
                            Manage Open Boxes
                        </a>
                    )}
                </div>
            )}

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
                                Records Series Title and Description
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
                                <td colSpan={12}>
                                    <ComponentLoader />
                                </td>
                            </tr>
                        ) : (
                            getAllRdsRecords.data &&
                            getAllRdsRecords.data
                                .filter((i) => {
                                    const searchableValues = [
                                        i.id,
                                        i.status,
                                        i.box_number,
                                        i.branches_id,
                                        i.created_at,
                                        i.updated_at,
                                        ...(i.documents
                                            ? i.documents.flatMap((doc) => [
                                                  doc.source_of_documents,
                                                  doc.description_of_document,
                                                  doc.period_covered_from,
                                                  doc.period_covered_to,
                                                  doc.remarks,
                                                  doc.projected_date_of_disposal,
                                                  doc.created_at,
                                                  doc.updated_at,
                                                  ...(doc.rds
                                                      ? [
                                                            doc.rds.item_number,
                                                            doc.rds
                                                                .record_series_title_and_description,
                                                            doc.rds.remarks,
                                                        ]
                                                      : []),
                                              ])
                                            : []),
                                    ];

                                    const matchesSearch = searchableValues.some(
                                        (value) =>
                                            value
                                                ?.toString()
                                                .toLowerCase()
                                                .includes(
                                                    searchTxt.toLowerCase()
                                                )
                                    );

                                    const matchesType =
                                        !recordTypeFilter ||
                                        i.status === recordTypeFilter;

                                    const matchesDate =
                                        !dateFrom && !dateTo
                                            ? true
                                            : i.documents?.some((doc) => {
                                                  const fromDate = new Date(
                                                      doc.period_covered_from
                                                  );
                                                  const toDate = new Date(
                                                      doc.period_covered_to
                                                  );
                                                  const filterFrom = dateFrom
                                                      ? new Date(dateFrom)
                                                      : null;
                                                  const filterTo = dateTo
                                                      ? new Date(dateTo)
                                                      : null;

                                                  return (
                                                      (!filterFrom ||
                                                          toDate >=
                                                              filterFrom) &&
                                                      (!filterTo ||
                                                          fromDate <= filterTo)
                                                  );
                                              });

                                    return (
                                        matchesSearch &&
                                        matchesType &&
                                        matchesDate
                                    );
                                })
                                .map((data) => (
                                    <>
                                        <tr
                                            key={"data" + data.id}
                                            id={"data" + data.id}
                                            className="group cursor-pointer hover:bg-gray-300 transition-all ease-in-out duration-300"
                                        >
                                            <td
                                                colSpan={12}
                                                className="py-2 text-left border-b border-slate-300"
                                            >
                                                {(data.status === "APPROVED" ||
                                                    data.status ===
                                                        "DISPOSED" ||
                                                    data.status ===
                                                        "RELEASED") &&
                                                    data.box_number}
                                                {data.status === "DECLINED" && (
                                                    <div className="inline text-xs px-2 py-0.5 bg-red-500 text-white rounded-full">
                                                        Declined
                                                    </div>
                                                )}
                                                {data.status === "DECLINED" &&
                                                    userType === "EMPLOYEE" && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                openDrawer(
                                                                    "edit",
                                                                    data
                                                                )
                                                            }
                                                            className="opacity-0 group-focus:opacity-100 group-hover:opacity-100 ml-2 bg-white text-blue-700 border border-blue-700 px-2 py-1 text-xs transition-all ease-in-out duration-300 rounded"
                                                        >
                                                            Edit
                                                        </button>
                                                    )}
                                                {data.status === "PENDING" && (
                                                    <div className="bg-gray-500 text-xs inline text-white py-0.5 px-2 rounded-full ml-1">
                                                        Pending
                                                    </div>
                                                )}
                                                {data.status === "PENDING" &&
                                                    userType ===
                                                        "RECORDS_CUST" && (
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
                                                {data.status === "PENDING" &&
                                                    userType ===
                                                        "RECORDS_CUST" && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                confirmDeclineRecord(
                                                                    data.id
                                                                )
                                                            }
                                                            className="opacity-0 group-focus:opacity-100 group-hover:opacity-100 ml-2 bg-white text-red-700 border border-red-700 px-2 py-1 text-xs transition-all ease-in-out duration-300 rounded"
                                                        >
                                                            Decline
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

                                                {data.status ===
                                                    "PENDING_DISPOSAL" && (
                                                    <div className="inline ml-2 rounded-full bg-orange-600 text-white px-1.5 py-0.5 text-xs">
                                                        Submitted for Disposal
                                                    </div>
                                                )}

                                                {data.status === "RELEASED" && (
                                                    <div className="inline ml-2 rounded-full bg-yellow-600 text-white px-1.5 py-0.5 text-xs">
                                                        Released: Asssds
                                                    </div>
                                                )}

                                                {data.status === "DISPOSED" && (
                                                    <div className="inline ml-2 rounded-full bg-red-600 text-white px-1.5 py-0.5 text-xs">
                                                        Disposed
                                                    </div>
                                                )}
                                                {userType !==
                                                    "WAREHOUSE_CUST" && (
                                                    <div className="mt-3">
                                                        <a
                                                            href={`/rds-record-history/${data.id}`}
                                                            target="_blank"
                                                            className="text-xs text-blue-600 hover:underline"
                                                        >
                                                            View Box History
                                                        </a>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                        {data.documents.map((doc) => {
                                            const lastHistory =
                                                doc.history?.[
                                                    doc.history.length - 1
                                                ];
                                            const isPending =
                                                lastHistory?.action ===
                                                    "INIT_BORROW" &&
                                                lastHistory?.users_id ===
                                                    currId;
                                            return (
                                                <tr
                                                    key={"doc" + doc.id}
                                                    id={"doc" + doc.id}
                                                    className="group cursor-pointer hover:bg-gray-300 transition-all ease-in-out duration-300"
                                                >
                                                    <td className="py-2 text-left border-b border-slate-300">
                                                        {userType ===
                                                            "EMPLOYEE" &&
                                                        doc.current_status ===
                                                            "AVAILABLE" &&
                                                        !isPending &&
                                                        data.status ===
                                                            "APPROVED" &&
                                                        data.history[0]
                                                            .location !==
                                                            "Warehouse" ? (
                                                            <>
                                                                <div className="text-xs text-slate-500 mb-1 px-1 italic">
                                                                    Borrow?
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    className={`mx-1 px-2 py-1 text-xs duration-300 rounded ${
                                                                        cart.some(
                                                                            (
                                                                                item
                                                                            ) =>
                                                                                item.id ===
                                                                                doc.id
                                                                        )
                                                                            ? "bg-green-500 text-white border border-green-500"
                                                                            : "bg-green-700 text-white border border-green-700"
                                                                    }`}
                                                                    onClick={() =>
                                                                        toggleCart(
                                                                            doc
                                                                        )
                                                                    }
                                                                >
                                                                    {cart.some(
                                                                        (
                                                                            item
                                                                        ) =>
                                                                            item.id ===
                                                                            doc.id
                                                                    )
                                                                        ? "Remove"
                                                                        : "Add"}
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <div className="text-xs text-slate-500 mb-1 px-1 italic">
                                                                {userType ===
                                                                "EMPLOYEE"
                                                                    ? "Unavailable"
                                                                    : ""}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="py-2 border-b border-slate-300">
                                                        {doc.rds.item_number}
                                                    </td>
                                                    <td className="py-2 border-b border-slate-300">
                                                        {
                                                            doc.source_of_documents
                                                        }
                                                    </td>
                                                    <td className="py-2 border-b border-slate-300">
                                                        {
                                                            doc.description_of_document
                                                        }
                                                    </td>
                                                    <td className="py-2 text-left border-b border-slate-300">
                                                        {
                                                            doc.period_covered_from
                                                        }{" "}
                                                        -{" "}
                                                        {doc.period_covered_to}
                                                    </td>
                                                    <td className="py-2 text-center border-b border-slate-300">
                                                        {doc.rds.active}
                                                    </td>
                                                    <td className="py-2 text-center border-b border-slate-300">
                                                        {doc.rds.storage}
                                                    </td>
                                                    <td className="py-2 text-center border-b border-slate-300">
                                                        {doc.rds.active +
                                                            doc.rds.storage}
                                                    </td>
                                                    <td className="py-2 text-center border-b border-slate-300">
                                                        {doc.rds.remarks}
                                                    </td>
                                                    <td className="py-2 text-center border-b border-slate-300">
                                                        {
                                                            doc.projected_date_of_disposal
                                                        }
                                                    </td>
                                                    <td className="py-2 text-center border-b border-slate-300">
                                                        {data.history[0]
                                                            .location ===
                                                        "Warehouse"
                                                            ? "Records Center"
                                                            : data.history[0]
                                                                  .location}
                                                    </td>
                                                    <td className="py-2 text-center border-b border-slate-300">
                                                        {doc.remarks}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </>
                                ))
                        )}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
}
