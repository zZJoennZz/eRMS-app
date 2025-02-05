import axios from "axios";
import { API_URL } from "../configs/config";

export async function submit_request(data) {
    let res = await axios.post(`${API_URL}submit_request`, data);
    return res.data.data;
}

export async function get_releases(mode = "list") {
    let res = await axios.get(`${API_URL}releases/${mode}`, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });

    return res.data.data;
}

export async function approve_release(data) {
    let res = await axios.post(`${API_URL}approve_request_release`, data, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });

    return res.data.data;
}

export async function process_release(data) {
    let res = await axios.post(`${API_URL}process_request_release`, data, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });

    return res.data.data;
}

export async function delete_release(id) {
    let res = await axios.delete(`${API_URL}delete_release/${id}`, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });

    return res.data.data;
}
