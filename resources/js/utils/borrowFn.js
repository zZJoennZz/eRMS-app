import axios from "axios";
import { API_URL } from "../configs/config";

export async function all() {
    let res = await axios.get(`${API_URL}asws`, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });
    return res.data.data;
}

export async function borrow(cart, borrowReason) {
    const data = {
        cart, borrowReason
    }
    let res = await axios.post(`${API_URL}borrow`, data, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });

    return res.data.data;
}

export async function pending_borrows() {
    let res = await axios.get(`${API_URL}pending-borrows`, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });
    return res.data.data;
}

export async function process_borrow(data) {
    let res = await axios.post(`${API_URL}pending-borrows`, data, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });

    return res.data.data;
}

export async function borrowed() {
    let res = await axios.get(`${API_URL}borrowed`, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });
    return res.data.data;
}

export async function returnDoc(id, data) {
    let res = await axios.put(`${API_URL}return/${id}`, data, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });
    return res.data.data;
}

export async function receiveRc(id, data) {
    let res = await axios.put(`${API_URL}receive-rc/${id}`, data, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });
    return res.data.data;
}

export async function declineBorrow(data) {
    let res = await axios.post(`${API_URL}decline-borrows`, data, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });

    return res.data.data;
}

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