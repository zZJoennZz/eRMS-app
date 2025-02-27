import axios from "axios";
import { API_URL } from "../configs/config";

export async function all() {
    let res = await axios.get(`${API_URL}clusters`, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });
    return res.data.data;
}

export async function show(id) {
    let res = await axios.get(`${API_URL}clusters/${id}`, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });
    return res.data.data;
}

export async function update(data, id) {
    let res = await axios.put(`${API_URL}clusters/${id}`, data, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });
    return res.data.data;
}

export async function post(data) {
    let res = await axios.post(`${API_URL}clusters`, data, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });
    return res.data.data;
}
