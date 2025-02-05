import axios from "axios";
import { API_URL } from "../configs/config";

export async function all() {
    let res = await axios.get(`${API_URL}setting`, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });
    return res.data.data;
}

export async function save_changes(data) {
    let res = await axios.put(`${API_URL}setting`, data, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });

    return res.data.data;
}
