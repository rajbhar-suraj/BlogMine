import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/userContext/AuthContext';


const AuthForm = ({ formControls }) => {

    const [formData, setFormData] = useState({})
    const location = useLocation()
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

            await loginUser( formData )
            if (user) {
                navigate('/auth/blog/dashboard')
            }
        }
    }

    return (
        <div className='bg-black min-h-screen flex flex-col md:flex-row'>
        {/* Left side - Welcome message */}
        <div className='bg-black w-full md:w-1/2 flex justify-center items-center p-6'>
            <div className='flex flex-col space-y-3 text-center'>
                <h1 className='text-white text-4xl md:text-5xl font-extrabold'>Welcome to Blogs</h1>
                <p className='text-white text-lg md:text-2xl font-bold'>Share your experiences with us...</p>
            </div>
        </div>
    
        {/* Right side - Form */}
        <form onSubmit={submitHandler} className='bg-white w-full md:w-1/2 flex justify-center items-center p-6'>
            <div className='w-full max-w-md space-y-4'>
                <h1 className="text-2xl md:text-3xl text-center font-bold tracking-tight text-foreground">
                    {isRegisterPage ? 'Sign in to your account' : 'Create new account'}
                </h1>
                <p className="text-center text-sm md:text-base">
                    {isRegisterPage ? 'Already have an account?' : "Don't have an account?"}
                    <Link
                        className="font-medium ml-2 text-blue-600 hover:underline"
                        to={isRegisterPage ? '/auth/login' : '/auth/register'}
                    >
                        {isRegisterPage ? 'Login' : 'Register'}
                    </Link>
                </p>
    
                {/* Form Fields */}
                {
                    formControls.map((items) => (
                        <div key={items.id} className='space-y-1'>
                            <label className='text-sm text-gray-600'>{items.label}</label>
                            <input
                                onChange={changeHandler}
                                value={formData[items.name] || ''}
                                className='w-full border-2 border-gray-400 focus:outline-none focus:ring-2 focus:ring-black p-3 rounded-md'
                                type={items.type}
                                name={items.name}
                                placeholder={items.placeholder}
                                required
                            />
                        </div>
                    ))
                }
    
                {/* Submit Button */}
                <button className='w-full bg-black hover:bg-zinc-800 mt-2 text-white rounded-md p-3 font-semibold' type='submit'>
                    {isRegisterPage ? 'Sign up' : 'Sign in'}
                </button>
            </div>
        </form>
    </div>
    
    )
}

export default AuthForm