import axios from "axios";
import { API_URL } from "../configs/config";

export async function all() {
    let res = await axios.get(`${API_URL}transaction`, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });
    return res.data.data;
}

export async function post(data) {
    let res = await axios.post(`${API_URL}transaction`, data, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });

    return res.data.data;
}

export async function borrowed_records_without_returns() {
    let res = await axios.get(`${API_URL}get_borrowed_without_returns`, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });

    return res.data.data;
}

export async function last_five_borrowed_without_return() {
    let res = await axios.get(`${API_URL}last_five_borrowed_without_return`, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });

    return res.data.data;
}

export async function paper_consumption(fromDate = "", toDate = "") {
    let res = await axios.get(
        `${API_URL}get_paper_consumption/${
            fromDate === "" || toDate === "" ? "" : `${fromDate}/${toDate}`
        }`,
        {
            headers: {
                Authorization: localStorage.getItem("token"),
            },
        }
    );
    return res.data.data;
}
