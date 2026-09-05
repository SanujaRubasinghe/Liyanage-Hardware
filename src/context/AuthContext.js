import { createContext, useState, useEffect, useContext } from "react";
import LoadingPage from "../Components/LoadingPage";
import API from "../api"; 

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get("/auth/profile", {
            withCredentials: true,
        })
            .then((res) => setUser(res.data))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    const login = async (credentials) => {
        try {
           
            const res = await API.post("/auth/login", credentials, {
                withCredentials: true
            });

            const userProfile = await API.get("/auth/profile", {
                withCredentials: true
            });

            setUser(userProfile.data);
            return res
        } catch (err) {
            console.error("Login failed:",err);
        }
    };

    const logout = async () => {
        try {
            await API.post("/auth/logout", {
                withCredentials: true
            });
            setUser(null);
            window.location.href = '/login'
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

export const useAuthContext = () => useContext(AuthContext)
