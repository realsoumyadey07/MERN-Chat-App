import axios from "axios";

const openApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

export default openApi;