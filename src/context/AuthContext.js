import { createContext, useState, useEffect } from "react";
import LoadingPage from "../Components/LoadingPage";
import API from "../api"; // Replace with your API instance if different

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token"); 
        
        if (token) {
            
            API.get("/auth/profile", {
                headers: { Authorization: `Bearer ${token}` }, 
            })
                .then((res) => setUser(res.data)) 
                .catch(() => setUser(null)) 
                .finally(() => setLoading(false));
        } else {
            setLoading(false); 
        }
    }, []);

    const login = async (credentials) => {
        try {
           
            const res = await API.post("/auth/login", credentials);
            const { usertoken } = res.data;

            localStorage.setItem("token", usertoken);

            const userProfile = await API.get("/auth/profile", {
                headers: { Authorization: `Bearer ${usertoken}` },
            });

            setUser(userProfile.data);
        } catch (err) {
            console.error("Login failed:", err.response?.data || err.message);
        }
    };

    const logout = async () => {
        try {
            await API.post("/auth/logout");
            localStorage.removeItem("token"); 
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            setUser(null);
        } catch (err) {
            console.error("Logout failed", err.message);
        }
    };

    if (loading) {
        return <LoadingPage />; 
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
