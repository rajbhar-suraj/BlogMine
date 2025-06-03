import { useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import toast from 'react-hot-toast';
const API = import.meta.env.VITE_API_URL;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)


    const getUser = async () => {
        try {
            const response = await axios.get(`${API}/auth/me`, { withCredentials: true })
            setUser(response.data)
            // 🔥 ADD THIS:

        } catch (error) {
            setUser(null)
            console.log("Failed to fetch user", error.message);

        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getUser()
    }, [])

    const registerUser = async ({ formData }) => {
        try {
            const response = await axios.post(`${API}/auth/register`, formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            toast.success('Registration successful!');

        } catch (error) {
            toast.error(err.response?.data?.message || 'Registration failed');
        }
    }

    const logoutUser = async () => {
        console.log('logout');
        try {
            await axios.post(`${API}/auth/logout`, {}, { withCredentials: true })
            setUser(null)
            toast.success('Logged out successfully!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Logged out failed');
        }
    }

    const loginUser = async ( formData ) => {
        try {
            const response = await axios.post(`https://blogmine-22pp.onrender.com/auth/login`, formData, { withCredentials: true })
            console.log(response.data);
            await getUser()
            toast.success('Logged in successfully!');
        } catch (err) {
            console.log(err);
            toast.error(err.response?.data?.message);
        }
    }

    const value = {
        registerUser, user, setUser, loginUser, logoutUser, loading
    }
    return <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
}