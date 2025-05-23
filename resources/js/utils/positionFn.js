import axios from "axios";
import { API_URL } from "../configs/config";

export async function all() {
    let res = await axios.get(`${API_URL}positions`, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });
    return res.data.data;
}

export async function show(id) {
    let res = await axios.get(`${API_URL}positions/${id}`, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });
    return res.data.data;
}

export async function update(data, id) {
    let res = await axios.put(`${API_URL}positions/${id}`, data, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });
    return res.data.data;
}

export async function post(data) {
    let res = await axios.post(`${API_URL}positions`, data, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });
    return res.data.data;
}

export async function switchPos(id) {
    let res = await axios.put(`${API_URL}switch-position/${id}`, null, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });
    return res.data.data;
}
