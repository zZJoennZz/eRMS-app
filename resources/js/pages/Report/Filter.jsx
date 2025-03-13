// import React, { useState } from "react";

// export default function Filter({ type }) {
//     return (
//         <>
//             {type === "branchSummary" && <BranchRecords />}
//             {type === "branchBoxes" && <BranchBoxes />}
//             {type === "disposedBoxSum" && <DisposedBoxes />}
//         </>
//     );
// }

// function BranchRecords() {
//     const [repFilter, setRepFilter] = useState({
//         from_date: "",
//         to_date: "",
//         reportType: "branchSummary",
//     });

//     function frmFieldHandler(e) {
//         setRepFilter((prev) => {
//             return {
//                 ...prev,
//                 [e.target.name]: e.target.value,
//             };
//         });
//     }

//     function prepareFilters() {
//         window.location.href = `/print-branch-summary/${JSON.stringify(
//             repFilter
//         )}`;
//     }

//     return (
//         <>
//             <form>
//                 <div
//                     className="p-5 overflow-y-scroll"
//                     style={{ maxHeight: "80vh" }}
//                 >
//                     <div className="mb-4">
//                         <div className="mb-1">
//                             <label htmlFor="from_date">Date Range</label>
//                         </div>
//                         <div>
//                             <input
//                                 type="date"
//                                 name="from_date"
//                                 id="from_date"
//                                 value={repFilter.from_date}
//                                 onChange={frmFieldHandler}
//                                 className="w-full"
//                                 required
//                             />
//                         </div>
//                         <div className="text-center py-1 text-sm text-slate-500">
//                             to
//                         </div>
//                         <div>
//                             <input
//                                 type="date"
//                                 name="to_date"
//                                 id="to_date"
//                                 value={repFilter.to_date}
//                                 onChange={frmFieldHandler}
//                                 className="w-full"
//                                 required
//                             />
//                         </div>
//                     </div>
//                 </div>
//                 <div className="absolute bottom-0 p-5 bg-slate-200 border-t border-slate-300 w-full">
//                     <button
//                         onClick={prepareFilters}
//                         type="button"
//                         className={`bg-lime-600 hover:bg-lime-500 transition-all ease-in-out duration-300 text-white py-2 px-6 rounded`}
//                     >
//                         Run Report
//                     </button>
//                 </div>
//             </form>
//         </>
//     );
// }

// function BranchBoxes() {
//     const [repFilter, setRepFilter] = useState({
//         from_date: "",
//         to_date: "",
//         reportType: "branchBoxes",
//     });

//     function frmFieldHandler(e) {
//         setRepFilter((prev) => {
//             return {
//                 ...prev,
//                 [e.target.name]: e.target.value,
//             };
//         });
//     }

//     function prepareFilters() {
//         window.location.href = `/print-branch-summary/${JSON.stringify(
//             repFilter
//         )}`;
//     }

//     return (
//         <>
//             <form>
//                 <div
//                     className="p-5 overflow-y-scroll"
//                     style={{ maxHeight: "80vh" }}
//                 >
//                     <div className="mb-4">
//                         <div className="mb-1">
//                             <label htmlFor="from_date">Date Range</label>
//                         </div>
//                         <div>
//                             <input
//                                 type="date"
//                                 name="from_date"
//                                 id="from_date"
//                                 value={repFilter.from_date}
//                                 onChange={frmFieldHandler}
//                                 className="w-full"
//                                 required
//                             />
//                         </div>
//                         <div className="text-center py-1 text-sm text-slate-500">
//                             to
//                         </div>
//                         <div>
//                             <input
//                                 type="date"
//                                 name="to_date"
//                                 id="to_date"
//                                 value={repFilter.to_date}
//                                 onChange={frmFieldHandler}
//                                 className="w-full"
//                                 required
//                             />
//                         </div>
//                     </div>
//                 </div>
//                 <div className="absolute bottom-0 p-5 bg-slate-200 border-t border-slate-300 w-full">
//                     <button
//                         onClick={prepareFilters}
//                         type="button"
//                         className={`bg-lime-600 hover:bg-lime-500 transition-all ease-in-out duration-300 text-white py-2 px-6 rounded`}
//                     >
//                         Run Report
//                     </button>
//                 </div>
//             </form>
//         </>
//     );
// }

// function DisposedBoxes() {
//     const [repFilter, setRepFilter] = useState({
//         from_date: "",
//         to_date: "",
//         reportType: "disposedBoxSum",
//     });

//     function frmFieldHandler(e) {
//         setRepFilter((prev) => {
//             return {
//                 ...prev,
//                 [e.target.name]: e.target.value,
//             };
//         });
//     }

//     function prepareFilters() {
//         window.location.href = `/print-branch-summary/${JSON.stringify(
//             repFilter
//         )}`;
//     }

//     return (
//         <>
//             <form>
//                 <div
//                     className="p-5 overflow-y-scroll"
//                     style={{ maxHeight: "80vh" }}
//                 >
//                     <div className="mb-4">
//                         <div className="mb-1">
//                             <label htmlFor="from_date">Date Range</label>
//                         </div>
//                         <div>
//                             <input
//                                 type="date"
//                                 name="from_date"
//                                 id="from_date"
//                                 value={repFilter.from_date}
//                                 onChange={frmFieldHandler}
//                                 className="w-full"
//                                 required
//                             />
//                         </div>
//                         <div className="text-center py-1 text-sm text-slate-500">
//                             to
//                         </div>
//                         <div>
//                             <input
//                                 type="date"
//                                 name="to_date"
//                                 id="to_date"
//                                 value={repFilter.to_date}
//                                 onChange={frmFieldHandler}
//                                 className="w-full"
//                                 required
//                             />
//                         </div>
//                     </div>
//                 </div>
//                 <div className="absolute bottom-0 p-5 bg-slate-200 border-t border-slate-300 w-full">
//                     <button
//                         onClick={prepareFilters}
//                         type="button"
//                         className={`bg-lime-600 hover:bg-lime-500 transition-all ease-in-out duration-300 text-white py-2 px-6 rounded`}
//                     >
//                         Run Report
//                     </button>
//                 </div>
//             </form>
//         </>
//     );
// }

// import React, { useState } from "react";

// export default function Filter({ type }) {
//     const reportComponents = {
//         branchSummary: "branchSummary",
//         branchBoxes: "branchBoxes",
//         disposedBoxSum: "disposedBoxSum",
//         disposedRecordsSum: "disposedRecordsSum",
//     };

//     return reportComponents[type] ? <ReportForm reportType={type} /> : null;
// }

// function ReportForm({ reportType }) {
//     const [repFilter, setRepFilter] = useState({
//         from_date: "",
//         to_date: "",
//         reportType,
//     });

//     function frmFieldHandler(e) {
//         setRepFilter((prev) => ({
//             ...prev,
//             [e.target.name]: e.target.value,
//         }));
//     }

//     function prepareFilters() {
//         window.location.href = `/print-branch-summary/${JSON.stringify(
//             repFilter
//         )}`;
//     }

//     return (
//         <form>
//             <div
//                 className="p-5 overflow-y-scroll"
//                 style={{ maxHeight: "80vh" }}
//             >
//                 <div className="mb-4">
//                     <div className="mb-1">
//                         <label htmlFor="from_date">Date Range</label>
//                     </div>
//                     <div>
//                         <input
//                             type="date"
//                             name="from_date"
//                             id="from_date"
//                             value={repFilter.from_date}
//                             onChange={frmFieldHandler}
//                             className="w-full"
//                             required
//                         />
//                     </div>
//                     <div className="text-center py-1 text-sm text-slate-500">
//                         to
//                     </div>
//                     <div>
//                         <input
//                             type="date"
//                             name="to_date"
//                             id="to_date"
//                             value={repFilter.to_date}
//                             onChange={frmFieldHandler}
//                             className="w-full"
//                             required
//                         />
//                     </div>
//                 </div>
//             </div>
//             <div className="absolute bottom-0 p-5 bg-slate-200 border-t border-slate-300 w-full">
//                 <button
//                     onClick={prepareFilters}
//                     type="button"
//                     className="bg-lime-600 hover:bg-lime-500 transition-all ease-in-out duration-300 text-white py-2 px-6 rounded"
//                 >
//                     Run Report
//                 </button>
//             </div>
//         </form>
//     );
// }

import React, { useEffect, useState } from "react";
import { API_URL } from "../../configs/config";

export default function Filter({ type }) {
    const reportComponents = {
        branchSummary: {
            label: "Branch Summary",
            fields: ["from_date", "to_date"],
        },
        branchBoxes: {
            label: "Branch Boxes",
            fields: ["from_date", "to_date"],
        },
        disposedBoxSum: {
            label: "Disposed Boxes",
            fields: ["from_date", "to_date"],
        },
        borrowsAndReturns: {
            label: "Borrows and Returns",
            fields: ["from_date", "to_date"],
        },
        recordsByUser: {
            label: "Records by user",
            fields: ["users_id"],
        },
        submittedDoc: {
            label: "Submitted Documents",
            fields: ["from_date", "to_date"],
        },
        warehouseSummary: {
            label: "Warehouse Summary",
            fields: ["from_date", "to_date"],
        },
        warehouseRecords: {
            label: "Records Summary",
            fields: ["from_date", "to_date"],
        },
    };

    return reportComponents[type] ? (
        <ReportForm reportType={type} fields={reportComponents[type].fields} />
    ) : null;
}

function ReportForm({ reportType, fields }) {
    const [users, setUsers] = useState([]);
    const [branches, setBranches] = useState([]);
    const initialState = fields.reduce(
        (acc, field) => {
            acc[field] = "";
            return acc;
        },
        { reportType }
    );

    const [repFilter, setRepFilter] = useState(initialState);

    function frmFieldHandler(e) {
        setRepFilter((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    }

    function prepareFilters() {
        window.location.href = `/print-branch-summary/${JSON.stringify(
            repFilter
        )}`;
    }

    useEffect(() => {
        const source = axios.CancelToken.source();
        async function getUsers() {
            await axios
                .get(`${API_URL}users`, {
                    headers: {
                        Authorization: localStorage.getItem("token") || "",
                    },
                    cancelToken: source.token,
                })
                .then((res) => {
                    setUsers(res.data.data);
                })
                .catch(() => {
                    toast.error("Invalid parameters.");
                });
        }

        async function getBranches() {
            await axios
                .get(`${API_URL}branches`, {
                    headers: {
                        Authorization: localStorage.getItem("token") || "",
                    },
                    cancelToken: source.token,
                })
                .then((res) => {
                    setBranches(res.data.data);
                })
                .catch(() => {
                    toast.error("Invalid parameters.");
                });
        }

        if (reportType === "recordsByUser") {
            getUsers();
        }

        if (reportType === "warehouseRecords") {
            getBranches();
        }

        return () => {
            source.cancel();
        };
    }, [reportType]);

    return (
        <form>
            <div
                className="p-5 overflow-y-scroll"
                style={{ maxHeight: "80vh" }}
            >
                {fields.includes("from_date") && (
                    <div className="mb-4">
                        <div className="mb-1">
                            <label htmlFor="from_date">Date Range</label>
                        </div>
                        <div>
                            <input
                                type="date"
                                name="from_date"
                                id="from_date"
                                value={repFilter.from_date}
                                onChange={frmFieldHandler}
                                className="w-full"
                                required
                            />
                        </div>
                        <div className="text-center py-1 text-sm text-slate-500">
                            to
                        </div>
                        <div>
                            <input
                                type="date"
                                name="to_date"
                                id="to_date"
                                value={repFilter.to_date}
                                onChange={frmFieldHandler}
                                className="w-full"
                                required
                            />
                        </div>
                    </div>
                )}

                {fields.includes("users_id") && (
                    <div className="mb-4">
                        <div className="mb-1">
                            <label htmlFor="users_id">Employee</label>
                        </div>
                        <div>
                            <select
                                type="text"
                                name="users_id"
                                id="users_id"
                                value={repFilter.users_id}
                                onChange={frmFieldHandler}
                                className="w-full"
                                required
                            >
                                <option>Select user</option>
                                {users &&
                                    users.map(
                                        (user) =>
                                            user.type === "EMPLOYEE" && (
                                                <option
                                                    key={user.id}
                                                    value={user.id}
                                                >
                                                    {user.profile.first_name}{" "}
                                                    {user.profile.middle_name}{" "}
                                                    {user.profile.last_name}
                                                </option>
                                            )
                                    )}
                            </select>
                        </div>
                    </div>
                )}
                {/* Future fields can be added dynamically here */}
                {reportType === "branchSummary" ||
                    (reportType === "branchBoxes" && (
                        <div className="mb-4">
                            <div className="mb-1">
                                <label htmlFor="from_date">Scope</label>
                            </div>
                            <div>
                                <select
                                    type="text"
                                    name="scope"
                                    id="scope"
                                    value={repFilter.scope}
                                    onChange={frmFieldHandler}
                                    className="w-full"
                                    required
                                >
                                    <option>Select scope of report</option>
                                    <option value="both">Both</option>
                                    <option value="branch_only">
                                        Branch Only
                                    </option>
                                    <option value="warehouse_only">
                                        Warehouse Only
                                    </option>
                                </select>
                            </div>
                        </div>
                    ))}

                {reportType === "warehouseRecords" && branches && (
                    <div className="mb-4">
                        <div className="mb-1">
                            <label htmlFor="from_date">Scope</label>
                        </div>
                        <div>
                            <select
                                type="text"
                                name="scope"
                                id="scope"
                                value={repFilter.scope}
                                onChange={frmFieldHandler}
                                className="w-full"
                                required
                            >
                                <option>Please select scope of report</option>
                                <option value="all">All branches</option>
                                {branches.map(
                                    (branch) =>
                                        branch.name !== "Warehouse" && (
                                            <option
                                                value={branch.id}
                                                key={branch.id}
                                            >
                                                {branch.name}
                                            </option>
                                        )
                                )}
                            </select>
                        </div>
                    </div>
                )}
            </div>
            <div className="absolute bottom-0 p-5 bg-slate-200 border-t border-slate-300 w-full">
                <button
                    onClick={prepareFilters}
                    type="button"
                    className="bg-lime-600 hover:bg-lime-500 transition-all ease-in-out duration-300 text-white py-2 px-6 rounded"
                >
                    Run Report
                </button>
            </div>
        </form>
    );
}
