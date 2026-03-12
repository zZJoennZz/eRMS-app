import axios from "axios";
import { API_URL } from "../configs/config";

/**
 * Fetch bank activity logs (Audit Trail)
 * @param {Object} params - Filtering parameters (page, search, start_date, end_date)
 */
export async function getActivityLogs(params = {}) {
    let res = await axios.get(`${API_URL}activity-logs`, {
        params: params, // Axios will automatically convert this to query strings
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });
    
    // We return the whole response object here because for paginated 
    // data, you'll need the meta information (total pages, current page, etc.)
    return res.data.data;
}

/**
 * Export filtered activity logs to CSV
 */
export async function exportActivityLogs(params) {
    let res = await axios.get(`${API_URL}activity-logs/export-csv`, {
        params,
        headers: {
            Authorization: localStorage.getItem("token"),
        },
        responseType: 'blob', // Required for file downloads
    });
    return res;
}