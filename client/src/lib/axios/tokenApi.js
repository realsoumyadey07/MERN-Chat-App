import axios from "axios";

let access_token = null;

if (typeof window !== "undefined") {
  // This ensures the code runs only in the browser
  access_token = localStorage.getItem("access_token");
}

const tokenApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${access_token}`
    }
});

export default tokenApi;