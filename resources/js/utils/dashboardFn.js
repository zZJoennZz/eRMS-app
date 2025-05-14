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

export async function bhDashboard() {
    let res = await axios.get(`${API_URL}bh-dashboard`, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });

    return res.data.data;
}

export async function empDashboard() {
    let res = await axios.get(`${API_URL}emp-dashboard`, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });

    return res.data.data;
}

export async function whDashboard() {
    let res = await axios.get(`${API_URL}wh-dashboard`, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });

    return res.data.data;
}


export async function whHeadDashboard() {
    let res = await axios.get(`${API_URL}wh-head-dashboard`, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });

    return res.data.data;
}

export async function adminDashboard() {
    let res = await axios.get(`${API_URL}admin-dashboard`, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });

    return res.data.data;
}
