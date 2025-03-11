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

export async function borrow(data) {
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
