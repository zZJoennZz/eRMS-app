import axios from "axios";
import { API_URL } from "../configs/config";

export async function get_data() {
    let res = await axios.get(`${API_URL}get_dashboard`, {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    });
    return res.data.data;
}
