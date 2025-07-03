import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/userContext/AuthContext';

const AuthForm = ({ formControls }) => {
    const [formData, setFormData] = useState({})
    const { registerUser, loginUser, user } = useAuthContext()
    const isRegisterPage = location.pathname === '/auth/register'
    const navigate = useNavigate()

    function changeHandler(e) {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    async function submitHandler(e) {
        e.preventDefault()
        if (isRegisterPage) {
            await registerUser({ formData })
            navigate('/auth/login')
        } else {
            await loginUser({ formData })
            if (user) {
                navigate('/auth/blog/dashboard')
            }
        }
    }

    return (
        <div className='min-h-screen flex flex-col lg:flex-row'>
            <div className='hidden lg:flex w-1/2 bg-black justify-center items-center'>
                <div className='flex flex-col space-y-3 px-4'>
                    <h1 className='text-white text-5xl font-extrabold text-center'>Welcome to Blogs</h1>
                    <p className='text-white text-2xl text-center'>Share your experiences with us...</p>
                </div>
            </div>
            <div className='w-full min-h-screen lg:w-1/2 flex justify-center items-center bg-white px-4 py-12'>
                <form onSubmit={submitHandler} className='w-full max-w-md space-y-3'>
                    <h1 className="text-2xl sm:text-3xl text-center font-bold tracking-tight text-foreground">
                        {isRegisterPage ? 'Create new account' : 'Sign in to your account'}
                    </h1>
                    <p className="text-center">
                        {isRegisterPage ? 'Already have an account' : "Don't have an account"}
                        <Link
                            className="font-medium ml-2 text-primary hover:underline"
                            to={isRegisterPage ? '/auth/login' : '/auth/register'}
                        >
                            {isRegisterPage ? 'Login' : 'Register'}
                        </Link>
                    </p>
                    {formControls.map((items) => (
                        <div key={items.id}>
                            <label className='text-sm text-gray-500 ml-1 mb-1 block'>{items.label}</label>
                            <input
                                onChange={changeHandler}
                                value={formData[items.name] || ''}
                                className='w-full border focus:outline-none focus:ring-2 focus:ring-zinc-800 p-3 rounded-md'
                                type={items.type}
                                name={items.name}
                                placeholder={items.placeholder}
                                required />
                        </div>
                    ))}
                    <button className='w-full bg-black hover:bg-zinc-800 text-white rounded-md p-2 font-semibold' type='submit'>
                        {isRegisterPage ? 'Sign up' : 'Sign in'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default AuthForm