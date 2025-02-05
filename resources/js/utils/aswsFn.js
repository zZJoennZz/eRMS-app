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

export async function post(data) {
    let res = await axios.post(`${API_URL}asws`, data, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });

    return res.data.data;
}

export async function show(id) {
    let res = await axios.get(`${API_URL}asws/${id}`, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });
    return res.data.data;
}

export async function process(id, data) {
    let res = await axios.post(`${API_URL}process_asws/${id}`, data, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });
    return res.data.data;
}
