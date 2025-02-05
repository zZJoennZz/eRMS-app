import axios from "axios";
import { API_URL } from "../configs/config";

export async function all() {
    let res = await axios.get(`${API_URL}item`, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });
    return res.data.data;
}

export async function all_public() {
    let res = await axios.get(`${API_URL}items`);
    return res.data.data;
}

export async function show(id) {
    let res = await axios.get(`${API_URL}item/${id}`, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });

    return res.data.data;
}

export async function post(data) {
    let res = await axios.post(`${API_URL}item`, data, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });
    return res.data.data;
}

export async function put(data, id) {
    let res = await axios.put(`${API_URL}item/${id}`, data, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });
    return res.data.data;
}

export async function delete_item(id) {
    let res = await axios.delete(`${API_URL}item/${id}`, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });
    return res.data.data;
}
