import axios from "axios";


const tokenApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

tokenApi.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
      const access_token = localStorage.getItem("access_token");
      if (access_token) {
          config.headers["Authorization"] = `Bearer ${access_token}`;
      }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default tokenApi;