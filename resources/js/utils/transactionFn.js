import axios from "axios";
import { API_URL } from "../configs/config";

export async function all() {
    let res = await axios.get(`${API_URL}transactions`, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });
    return res.data.data;
}

export async function post(data) {
    let res = await axios.post(`${API_URL}transactions`, data, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });

    return res.data.data;
}

export async function recordsForTransfer() {
    let res = await axios.get(`${API_URL}records_for_transfer`, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });

    return res.data.data;
}

export async function approveTransaction(data) {
    let res = await axios.post(`${API_URL}approve-transaction`, data, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });

    return res.data.data;
}

export async function declineTransaction(data) {
    let res = await axios.post(`${API_URL}decline-transaction`, data, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });

    return res.data.data;
}

export async function processTransaction(data) {
    let res = await axios.post(`${API_URL}process-transaction`, data, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });

    return res.data.data;
}

export async function returnRelease(id) {
    let res = await axios.put(`${API_URL}return-transfer/${id}`, null, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });

    return res.data.data;
}
