import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import WarehouseRecords from "./Summaries/WarehouseRecords";
import ComponentLoader from "../../components/ComponentLoader";
import { toast } from "react-toastify";
import { API_URL } from "../../configs/config";
import BranchRecords from "./Summaries/BranchRecords";
import BranchBoxes from "./Summaries/BranchBoxes";
import DisposedBoxes from "./Summaries/DisposedBoxes";
import DisposedRecords from "./Summaries/DisposedRecords";
import RecordsByUser from "./Summaries/RecordsByUser";
import BorrowsAndReturns from "./Summaries/BorrowsAndReturns";
import CurrentBorrows from "./Summaries/CurrentBorrows";
import EmployeeBorrows from "./Summaries/EmployeeBorrows";
import SubmittedDocuments from "./Summaries/SubmittedDocuments";
import WarehouseSummary from "./Summaries/WarehouseSummary";

export default function ReportDocuments() {
    const { filters } = useParams();
    const [reportData, setReportData] = useState(false);
    const reportFilters = JSON.parse(filters);

    useEffect(() => {
        const source = axios.CancelToken.source();
        async function getReportsData() {
            await axios
                .post(`${API_URL}record-report`, reportFilters, {
                    headers: {
                        Authorization: localStorage.getItem("token") || "",
                    },
                    cancelToken: source.token,
                })
                .then((res) => {
                    setReportData(res.data.data);
                })
                .catch(() => {
                    toast.error("Invalid parameters.");
                });
        }

        getReportsData();

        return () => {
            source.cancel();
        };
    }, []);
    if (!reportData) return <ComponentLoader />;

    if (reportFilters.reportType === "warehouseRecords")
        return <WarehouseRecords reportData={reportData} />;
    if (reportFilters.reportType === "branchSummary")
        return <BranchRecords reportData={reportData} filters={filters} />;
    if (reportFilters.reportType === "branchBoxes")
        return <BranchBoxes reportData={reportData} filters={filters} />;
    if (reportFilters.reportType === "disposedBoxSum")
        return <DisposedBoxes reportData={reportData} />;
    if (reportFilters.reportType === "disposedRecordsSum")
        return <DisposedRecords reportData={reportData} />;
    if (reportFilters.reportType === "recordsByUser")
        return <RecordsByUser reportData={reportData} />;
    if (reportFilters.reportType === "borrowsAndReturns")
        return <BorrowsAndReturns reportData={reportData} />;
    if (reportFilters.reportType === "currentBorrowed")
        return <CurrentBorrows reportData={reportData} />;
    if (reportFilters.reportType === "currentBorrows")
        return <EmployeeBorrows reportData={reportData} />;
    if (reportFilters.reportType === "submittedDoc")
        return <SubmittedDocuments reportData={reportData} />;
    if (reportFilters.reportType === "submittedDoc")
        return <SubmittedDocuments reportData={reportData} />;
    if (reportFilters.reportType === "warehouseSummary")
        return <WarehouseSummary reportData={reportData} />;

    return false;
}
