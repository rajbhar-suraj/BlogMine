import { useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import axiosInstance from '../../api/axiosInstance';
import toast from 'react-hot-toast';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)


    const getUser = async () => {
        try {
            const response = await axiosInstance.get('/me');
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
            const response = await axiosInstance.post('/register', formData);

            toast.success('Registration successful!');

        } catch (error) {
            toast.error(err.response?.data?.message || 'Registration failed');
        }
    }

    const logoutUser = async () => {
        console.log('logout');
        try {
            await axiosInstance.post('/logout');
            setUser(null)
            toast.success('Logged out successfully!');
        } catch (err) {
          toast.error(err.response?.data?.message || 'Logged out failed');
        }
    }

    const loginUser = async ({ formData }) => {
        try {
            const response = await axiosInstance.post('/login', formData);
            await getUser()
            toast.success('Logged in successfully!');
        } catch (err) {
          toast.error(err.response?.data?.message || 'Login failed');
        }
    }

    const value = {
        registerUser, user, setUser, loginUser, logoutUser, loading
    }
    return <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
}