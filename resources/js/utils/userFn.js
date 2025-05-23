import axios from "axios";
import { API_URL } from "../configs/config";

export async function all() {
    let res = await axios.get(`${API_URL}users`, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });
    return res.data.data;
}

export async function show(id) {
    let res = await axios.get(`${API_URL}users/${id}`, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });
    return res.data.data;
}

export async function update(data, id) {
    let res = await axios.put(`${API_URL}users/${id}`, data, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });
    return res.data.data;
}

export async function post(data) {
    let res = await axios.post(`${API_URL}users`, data, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });
    return res.data.data;
}

export async function resetPassword(id) {
    let res = await axios.post(`${API_URL}reset-user-pw/${id}`, null, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });
    return res.data.data;
}

export async function changeOwnPassword(data) {
    let res = await axios.post(`${API_URL}change-my-password`, data, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });
    return res.data.data;
}

export async function allDisabled() {
    let res = await axios.get(`${API_URL}disabled-users`, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });
    return res.data.data;
}

export async function disableUser(id) {
    let res = await axios.put(`${API_URL}disable-user/${id}`, null, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });
    return res.data.data;
}

export async function enableUser(id) {
    let res = await axios.put(`${API_URL}enable-user/${id}`, null, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });
    return res.data.data;
}
