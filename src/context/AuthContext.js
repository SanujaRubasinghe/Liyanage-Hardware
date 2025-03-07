import { createContext, useState, useEffect } from "react";
import API from "../api"

export const AuthContext = createContext()

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null)

    useEffect(() => {
        API.get("/profile")
            .then((res) => setUser(res.data))
            .catch(() => setUser(null))
    }, [])

    const login = async (credentials) => {
        try {
            await API.post("/login", credentials)
            const res = await API.get("/profile")
            setUser(res.data)
            console.log(res.data)
        } catch (err) {
            console.error(err.response?.data || "Login failed")
        }
    }

    const logout = async () => {
        try {
            const res = await API.post("/logout")
            alert(res.data.message)
            setUser(null)
        } catch (err) {
            console.error("Logout failed")
        }
    }

    return (
        <AuthContext.Provider value={{user, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}