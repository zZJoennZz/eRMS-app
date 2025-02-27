import axios from "axios";
import { API_URL } from "../configs/config";

export async function emp_pending_trans() {
    let res = await axios.get(`${API_URL}employee-pending-transactions`, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });
    return res.data.data;
}
export async function pending_rds() {
    let res = await axios.get(`${API_URL}pending-rds`, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });
    return res.data.data;
}

export async function for_disposal() {
    let res = await axios.get(`${API_URL}for-disposal`, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });
    return res.data.data;
}

export async function rcDashboard() {
    let res = await axios.get(`${API_URL}rc-dashboard`, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });

    return res.data.data;
}
