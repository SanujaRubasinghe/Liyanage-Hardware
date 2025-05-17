import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import "./LogInPage.css"; // Import the CSS file

function LogInPage() {
    const [user, setUser] = useState({ username: "", password: "" });
    const { login } = useContext(AuthContext);

    const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(user);
            window.location.href = '/profile';
        } catch (err) {
            alert(err.response.data.error);
        }
    };

    return (
        <div className="login-container">
            
            <img src="/images/l1.png" alt="Logo" className="login-logo" />
            <form onSubmit={handleSubmit} className="login-form">
                <input
                    name="username"
                    onChange={handleChange}
                    placeholder="Username"
                    required
                    className="login-input"
                />
                <input
                    name="password"
                    type="password"
                    onChange={handleChange}
                    placeholder="Password"
                    required
                    className="login-input"
                />
                <button type="submit" className="login-button">Login</button>
            </form>
        </div>
    );
}

export default LogInPage;
