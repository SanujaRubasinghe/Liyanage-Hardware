import React, {useState} from 'react'
import {toast} from 'react-toastify'
import API from '../api'

const AdminLogin = ({onLogin}) => {
    const [credentials, setCredentials] = useState({username:'', password:''})
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setCredentials({...credentials, [e.target.name]: e.target.value})
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await API.post('/login', credentials)
            setLoading(false)

            if (res.status === 200) {
                toast.success('Login successful!')
                onLogin(res.data.admin)

            } else {
                toast.error(res.data.message || 'Login Failed')
            }
        } catch (error) {
            console.log(error)
            const errorMsg = error.response?.data?.message || error.message || 'Login Failed';
            toast.error(errorMsg)
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <form onSubmit={handleLogin} className="bg-white shadow-lg rounded-lg p-8 w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Admin Login</h2>
                
                <label className="block mb-2 text-sm font-medium text-gray-700">User Name</label>
                <input
                type="text"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                required
                className="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <label className="block mb-2 text-sm font-medium text-gray-700">Password</label>
                <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                required
                className="w-full mb-6 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition disabled:opacity-50"
                >
                {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    )
}

export default AdminLogin