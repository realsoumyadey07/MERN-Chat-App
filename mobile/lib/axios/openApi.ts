import axios from "axios";

const openApi = axios.create({
    baseURL: process.env.EXPO_PUBLIC_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

export default openApi;