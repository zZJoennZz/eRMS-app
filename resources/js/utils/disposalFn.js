import axios from "axios";
import { API_URL } from "../configs/config";

export async function all() {
    let res = await axios.get(`${API_URL}disposals`, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });
    return res.data.data;
}

export async function post(data) {
    let res = await axios.post(`${API_URL}disposals`, data, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });
    return res.data.data;
}

export async function approve(id) {
    let res = await axios.put(`${API_URL}disposals/approve/${id}`, null, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });
    return res.data.data;
}

export async function confirmDispose(id) {
    let res = await axios.put(`${API_URL}disposals/confirm/${id}`, null, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });
    return res.data.data;
}
