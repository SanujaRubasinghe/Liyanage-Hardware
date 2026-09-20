import axios from "axios"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

const API = axios.create({
    baseURL: `${API_BASE}/api/`,
    withCredentials: true
})

export default API
