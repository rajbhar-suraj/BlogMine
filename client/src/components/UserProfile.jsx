import React, { useState } from 'react';
import Navbar from './NavBar';
import { CiUser } from "react-icons/ci";
import { MdEdit } from "react-icons/md";
import { useAuthContext } from '../contexts/userContext/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import axiosInstance from '../api/axiosInstance';

const UserProfile = () => {
  const { user } = useAuthContext()


  const [isEditing, setIsEditing] = useState(false)
  const [userData, setUserData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || ''
  })


  const joinedDate = new Date(user?.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  function handleChange(e) {
    const { name, value } = e.target
    setUserData(prev => ({ ...prev, [name]: value }))
  }

  function editHandler() {
    setIsEditing(true)

  }
  async function saveHandler() {
    try {
      const res = await axiosInstance.put(`/userprofile/${user._id}`, userData);
      // If email was changed, logout the user
      if (user.email !== userData.email) {
        await axiosInstance.post('/logout');
        toast.success('Email updated. Please log in again.');
        setTimeout(() => {
          window.location.href = '/auth/login';
        }, 1500);
      } else {
        toast.success(res.data.message);
      }

      setIsEditing(false)

    } catch (error) {
      console.log(error, error.message);
    }
  }
  return (
    <div className='bg-gray-100 min-h-screen'>
      <Navbar />

      <div className='m-6 sm:m-8 flex flex-col items-center justify-center'>
        <h1 className='text-3xl sm:text-4xl font-bold'>Profile</h1>
        <p className='text-gray-600 text-lg sm:text-xl'>View all your profile details here.</p>
      </div>

      <div className='flex justify-center px-4 h-[60vh]'>
        <div className='w-full max-w-6xl rounded-md bg-zinc-800 text-white px-6 py-8 relative flex flex-col md:flex-row items-center gap-6'>
          {/* Edit Button */}
          {
            !isEditing && <button onClick={editHandler} className='absolute top-4 right-4 bg-white text-zinc-800 px-3 py-2 rounded-md flex items-center gap-1 hover:bg-zinc-200 transition'>
              <MdEdit className='text-xl' />
              Edit
            </button>
          }

          {/* Profile Icon */}
          <div className='flex justify-center items-center bg-black rounded-full h-50 w-50'>
            <CiUser className='text-white text-7xl sm:text-8xl' />
          </div>

          {/* User Info */}
          {isEditing ? (
            <form onSubmit={saveHandler} className='ml-10'>
              <label className='text-gray-500 text-sm'>Userame</label>
              <input type="text"
                name='name'
                value={userData?.name}
                onChange={handleChange}
                className='w-full p-2 rounded text-gray-400 border-1 border-gray-500'
              />
              <label className='text-gray-500 text-sm'>Email</label>
              <input type="text"
                name='email'
                value={userData?.email}
                onChange={handleChange}
                className='w-full p-2 rounded text-gray-400  border-1 border-gray-500'
              />
              <label className='text-gray-500 text-sm'>Bio</label>
              <input type="text"
                name='bio'
                value={userData?.bio}
                onChange={handleChange}
                className='w-full p-2 rounded text-gray-400 border-1 border-gray-500'
                placeholder='Write something about yourself...'
              />
              <button type="button" onClick={saveHandler} className='bg-gray-400 mt-5 text-zinc-800 px-4 py-2 rounded hover:bg-zinc-200 transition'>
                Save
              </button>

            </form>
          ) : (
            <div className='space-y-3 ml-10 text-center md:text-left'>
              <h2 className='text-2xl sm:text-3xl font-semibold'>{userData.name}</h2>
              <p><span className='font-semibold'>Email:</span> {userData.email}</p>
              <p><span className='font-semibold'>Bio: </span>{userData.bio || ' Write something...'}</p>
              <p><span className='font-semibold'>Role:</span> {userData.role || 'Author'}</p>
              <p><span className='font-semibold'>Joined:</span> {joinedDate}</p>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
