import { useState, useEffect, useContext } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { AuthContext } from "../contexts/AuthContext";
import { getActivityLogs, exportActivityLogs } from "../utils/activityFn";
import { formatAuditDate, getFileTimestamp } from "../utils/utilities";

export default function ActivityLog() {
    const { userType } = useContext(AuthContext);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);
    const [pagination, setPagination] = useState({ 
        current_page: 1, 
        last_page: 1,
        total: 0 
    });

    const [search, setSearch] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    useEffect(() => {
        fetchLogs();
    }, [pagination.current_page]);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const params = {
                page: pagination.current_page,
                search,
                start_date: startDate,
                end_date: endDate,
            };
            const response = await getActivityLogs(params);
            
            setLogs(response.data);
            setPagination({
                current_page: response.current_page,
                last_page: response.last_page,
                total: response.total
            });
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        // Reset to page 1 when searching
        setPagination(prev => ({ ...prev, current_page: 1 }));
        // If already on page 1, the useEffect won't trigger, so call manually
        if (pagination.current_page === 1) fetchLogs();
    };

    const handleExport = async () => {
        setExporting(true);
        try {
            const params = { search, start_date: startDate, end_date: endDate };
            const response = await exportActivityLogs(params);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Bank_Audit_${getFileTimestamp()}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            alert("Export failed.");
        } finally {
            setExporting(false);
        }
    };

    if (userType !== "ADMIN" && userType !== "DEV") {
        return (
            <DashboardLayout>
                <div className="p-10 text-center text-red-500 font-bold">Unauthorized Access</div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <h1 className="text-3xl font-semibold mb-1 mt-2 text-slate-600 border-b border-slate-300 pb-2">
                System Audit Trail 🛡️
            </h1>

            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-3 my-6 bg-white p-4 rounded-lg border shadow-sm items-end">
                <div className="flex flex-col">
                    <label className="text-xs font-bold text-slate-500 mb-1">Search</label>
                    <input type="text" className="p-2 border rounded text-sm bg-slate-50" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="User or action..." />
                </div>
                <div className="flex flex-col">
                    <label className="text-xs font-bold text-slate-500 mb-1">From</label>
                    <input type="date" className="p-2 border rounded text-sm bg-slate-50" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div className="flex flex-col">
                    <label className="text-xs font-bold text-slate-500 mb-1">To</label>
                    <input type="date" className="p-2 border rounded text-sm bg-slate-50" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
                <button type="submit" className="bg-slate-700 text-white p-2 rounded text-sm hover:bg-slate-800 transition h-9">Filter</button>
                <button 
                    type="button" 
                    onClick={handleExport} 
                    disabled={exporting}
                    className="bg-green-600 text-white p-2 rounded text-sm hover:bg-green-700 disabled:opacity-50 transition h-9"
                >
                    {exporting ? "Generating..." : "Export CSV 📊"}
                </button>
            </form>

            <div className="bg-white rounded-lg shadow overflow-hidden border border-slate-200">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                        <tr>
                            <th className="p-4 border-b">Timestamp</th>
                            <th className="p-4 border-b">Performer</th>
                            <th className="p-4 border-b">Action</th>
                            <th className="p-4 border-b">Metadata</th>
                        </tr>
                    </thead>
                    <tbody className="text-slate-600">
                        {loading ? (
                            <tr><td colSpan="4" className="p-10 text-center italic">Retrieving audit data...</td></tr>
                        ) : logs.length > 0 ? (
                            logs.map(log => (
                                <tr key={log.id} className="border-b hover:bg-slate-50 transition">
                                    <td className="p-4 text-xs whitespace-nowrap">
                                        {formatAuditDate(log.created_at)}
                                    </td>
                                    <td className="p-4 font-medium text-slate-700">{log.performer_name}</td>
                                    <td className="p-4">
                                        <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-[12px] font-bold border border-slate-200">
                                            {log.display_message}
                                        </span>
                                    </td>
                                    <td className="p-4 text-[10px] text-slate-400 font-mono max-w-xs truncate" title={JSON.stringify(log.properties)}>
                                        {JSON.stringify(log.properties)}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="4" className="p-10 text-center">No matching logs found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* RESTORED PAGINATION CONTROLS */}
            <div className="mt-4 flex justify-between items-center bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                <div className="text-xs text-slate-500">
                    Showing page <span className="font-bold text-slate-700">{pagination.current_page}</span> of <span className="font-bold text-slate-700">{pagination.last_page}</span>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setPagination(prev => ({ ...prev, current_page: prev.current_page - 1 }))}
                        disabled={pagination.current_page === 1 || loading}
                        className="px-4 py-1.5 text-xs font-medium border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                        Previous
                    </button>
                    <button 
                        onClick={() => setPagination(prev => ({ ...prev, current_page: prev.current_page + 1 }))}
                        disabled={pagination.current_page === pagination.last_page || loading}
                        className="px-4 py-1.5 text-xs font-medium border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                        Next
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
}