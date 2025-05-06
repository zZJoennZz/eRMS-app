import axios from "axios";
import { API_URL } from "../configs/config";

export async function getTurnovers() {
    let res = await axios.get(`${API_URL}turnovers`, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });
    return res.data.data;
}

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

export async function declineTurnover(id) {
    let res = await axios.post(`${API_URL}decline-turnover/${id}`, null, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });

    return res.data.data;
}
