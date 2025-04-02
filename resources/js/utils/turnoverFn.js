import axios from "axios";
import { API_URL } from "../configs/config";

export async function getTurnover() {
    let res = await axios.get(`${API_URL}turnover`, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });
    return res.data.data;
}

export async function submitTurnover(data) {
    let res = await axios.post(`${API_URL}turnover`, data, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });

    return res.data.data;
}

export async function approveTurnover(id) {
    let res = await axios.put(`${API_URL}turnover/${id}`, null, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });

    return res.data.data;
}
