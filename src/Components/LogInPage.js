import {useState, createContext} from 'react'
import axios from 'axios'

function LogInPage() {
    const [formData, setFormData] = useState({username:"", password:""})

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    const handleRegister = async (e) => {
        e.preventDefault()
        try {
            await axios.post("http://localhost:5000/register", formData)
            alert("User registered succesfully")
        } catch (error) {
            alert(error.respones?.data?.error || "Error registering user")
        }
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post('http://localhost:5000/login', formData)
            alert('Login successful! Token: ' + res.data.token)
            localStorage.setItem("token", res.data.token)
            window.location.href = '/'
        } catch(error) {
            alert(error.response?.data?.error || 'Error loggin in')
        }
    }
    return(
        <div>
            <h1>Login Page</h1>
            <form>
                <input type='text' name='username' placeholder='Username' onChange={handleChange} /> <br/>
                <input type='password' name='password' placeholder='Password' onChange={handleChange} /> <br/>
                <button onClick={handleLogin}>Login</button>
            </form>
        </div>
    )
}

export default LogInPage