import axios from "axios";
import { API_URL } from "../configs/config";

export async function all() {
    let res = await axios.get(`${API_URL}rds-records`, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });
    return res.data.data;
}

export async function post(data) {
    let res = await axios.post(`${API_URL}rds-records`, data, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });

    return res.data.data;
}

export async function put(data, id) {
    let res = await axios.put(`${API_URL}rds-records/${id}`, data, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });

    return res.data.data;
}

export async function show(id) {
    let res = await axios.get(`${API_URL}rds-records/${id}`, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });
    return res.data.data;
}

export async function approveRdsRecord(data) {
    let res = await axios.post(`${API_URL}approve-rds`, data, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });

    return res.data.data;
}

export async function declineRdsRecord(data) {
    let res = await axios.post(`${API_URL}decline-rds`, data, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });

    return res.data.data;
}

export async function warehouseSupply() {
    let res = await axios.get(`${API_URL}warehouse-supply`, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });

    return res.data.data;
}

export async function getHistory(id) {
    let res = await axios.get(`${API_URL}rds-record-history/${id}`, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });

    return res.data.data;
}

export async function updateRdsRecord(data, id) {
    let res = await axios.put(`${API_URL}rds-records/${id}`, data, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });

    return res.data.data;
}

export async function addToOpen(data) {
    let res = await axios.post(`${API_URL}rds-records-open`, data, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });

    return res.data.data;
}

export async function getOpenBoxes() {
    let res = await axios.get(`${API_URL}rds-records-open`, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });

    return res.data.data;
}

export async function createNewBoxForOpen(data) {
    let res = await axios.put(`${API_URL}rds-records-open`, data, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });

    return res.data.data;
}
