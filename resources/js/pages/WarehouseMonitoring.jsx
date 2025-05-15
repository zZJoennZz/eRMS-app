import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { warehouseSupply } from "../utils/rdsRecordFn";
import DashboardLayout from "../components/DashboardLayout";
import ComponentLoader from "../components/ComponentLoader";
import { formatDate } from "../utils/utilities";
import { PrinterIcon } from "@heroicons/react/24/solid";

function filterWarehouseData(
    data,
    searchField,
    searchTxt,
    dateFilterType,
    startDate,
    endDate
) {
    return data.filter((i) => {
        if (searchField === "history_created_at") {
            const recordDate = new Date(i.history_created_at);
            if (dateFilterType === "as_of") {
                return recordDate.toISOString().split("T")[0] < startDate;
            } else {
                return (
                    recordDate >= new Date(startDate) &&
                    recordDate <= new Date(endDate)
                );
            }
        } else {
            const fieldValue = i[searchField]?.toString().toLowerCase() || "";
            return fieldValue.includes(searchTxt.toLowerCase());
        }
    });
}

export default function WarehouseMonitoring() {
    const [searchTxt, setSearchTxt] = useState("");
    const [searchField, setSearchField] = useState("box_number");
    const [dateFilterType, setDateFilterType] = useState("as_of");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const getWarehouseSupply = useQuery({
        queryKey: ["allWarehouseSupply"],
        queryFn: () =>
            warehouseSupply({
                searchField,
                dateFilterType,
                startDate,
                endDate,
            }),
        retry: 2,
        networkMode: "always",
    }); 

    function prepareFilters() {
        const reportFilters = {
            searchTxt,
            searchField,
            dateFilterType,
            startDate,
            endDate,
            reportType: "warehouseRecords",
        };

        window.location.href = `/print-warehouse-documents/${JSON.stringify(
            reportFilters
        )}`;
    }
    return (
        <DashboardLayout>
            <h1 className="text-xl font-semibold mb-2">Records in Records Center</h1>
            <div className="mb-1 text-xs text-slate-500">Filter</div>
            <div className="mb-3 flex gap-2">
                <select
                    value={searchField}
                    onChange={(e) => setSearchField(e.target.value)}
                    className="p-2 border rounded"
                >
                    <option value="box_number">Box Number</option>
                    <option value="name">Branch</option>
                    <option value="history_created_at">Date Transferred</option>
                </select>
                {searchField === "history_created_at" ? (
                    <div className="flex gap-2">
                        <select
                            value={dateFilterType}
                            onChange={(e) => setDateFilterType(e.target.value)}
                            className="p-2 border rounded"
                        >
                            <option value="as_of">As Of</option>
                            <option value="date_range">Date Range</option>
                        </select>
                        {dateFilterType === "as_of" ? (
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="p-2 border rounded"
                            />
                        ) : (
                            <>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) =>
                                        setStartDate(e.target.value)
                                    }
                                    className="p-2 border rounded"
                                />
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="p-2 border rounded"
                                />
                            </>
                        )}
                    </div>
                ) : (
                    <input
                        type="text"
                        id="search"
                        name="search"
                        value={searchTxt}
                        onChange={(e) => setSearchTxt(e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="Search record here"
                    />
                )}
            </div>
            {searchField !== "box_number" && (
                <div className="mb-3">
                    <button
                        onClick={prepareFilters}
                        className="bg-blue-600 text-white inline px-2 py-1 rounded hover:bg-blue-500 duration-500 transition-all ease-in-out"
                    >
                        <PrinterIcon className="inline h-4 w-4 mr-2" /> Print
                    </button>
                </div>
            )}
            <div className="overflow-x-auto">
                <table className="mb-3 w-full">
                    <thead className="text-center text-xs font-semibold border-t border-b border-lime-600">
                        <tr>
                            <th className="text-left py-2">Box Number</th>
                            <th className="text-left py-2 w-1/2">Branch</th>
                            <th className="text-right py-2">
                                Date Transferred
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {getWarehouseSupply.isLoading ? (
                            <tr>
                                <td colSpan={3}>
                                    <ComponentLoader />
                                </td>
                            </tr>
                        ) : (
                            getWarehouseSupply.data &&
                            filterWarehouseData(
                                getWarehouseSupply.data,
                                searchField,
                                searchTxt,
                                dateFilterType,
                                startDate,
                                endDate
                            ).map((data) => (
                                <tr
                                    key={data.id}
                                    id={data.id}
                                    className="group cursor-pointer hover:bg-gray-300 transition-all ease-in-out duration-300"
                                >
                                    <td className="py-2 text-left border-b border-slate-300">
                                        {data.box_number}
                                        {data.status === "DISPOSED" && (
                                            <div className="text-xs px-1 py-0.5 rounded-full bg-red-700 text-white inline ml-2">
                                                Disposed
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-2 border-b border-slate-300">
                                        {data.name}
                                    </td>
                                    <td className="py-2 text-right border-b border-slate-300">
                                        {formatDate(data.history_created_at)}
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
