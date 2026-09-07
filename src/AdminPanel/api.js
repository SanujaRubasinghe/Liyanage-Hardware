import axios from "axios"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const API = axios.create({
    baseURL: `${API_BASE}/api/admin/`,
    withCredentials: true
})

export default API
