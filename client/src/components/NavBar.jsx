import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { FaCircleUser } from "react-icons/fa6";
import {  HiOutlineX } from "react-icons/hi";
import { FiLogOut, FiMenu } from "react-icons/fi";
import { GiBookshelf } from 'react-icons/gi';
import Button from './Button';
import { useAuthContext } from '../contexts/userContext/AuthContext';

const Navbar = () => {
  const { logoutUser,user } = useAuthContext()


  async function handleLogout() {
    await logoutUser()
  }
  const [menuOpen, setMenuOpen] = useState(false);
  const menuItems = [{ id: 1, name: 'Create Blog', path: '/auth/blog/create' }, { id: 2, name: 'Explore Blogs', path: '/auth/blog/allblogs' }, { id: 3, name: 'Bookmarks', path: '/auth/blog/bookmarks' }]
  return (
    <nav className='bg-white shadow-md sticky top-0 flex justify-between items-center p-3'>
      <div className='flex items-center space-x-2 cursor-pointer hover:text-zinc-700'>
        <GiBookshelf className='text-4xl ' />
        <Link to='/auth/blog/dashboard' className='text-3xl mt-3 font-medium font-serif leading-none'>BlogMine</Link>
      </div>


      <div className='space-x-8 mt-4 text-xl font-medium cursor-pointer hidden md:flex'>
        {
          menuItems.map((item) => (
            <div key={item.id} className=''>
              <Link className=' hover:text-zinc-700' to={item.path}>{item.name}</Link>
            </div>
          ))
        }
      </div>

      <div className='md:hidden mt-1'>
        <button onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? (
            <HiOutlineX className='text-3xl' />
          ) : (
            <FiMenu className='text-3xl' />
          )}
        </button>
      </div>

      {menuOpen && (
        <div className='md:hidden flex flex-col items-start px-4 pb-4 space-y-2 text-lg font-medium'>
          {menuItems.map(item => (
            <Link key={item.id} to={item.path} className='hover:text-zinc-700' onClick={() => setMenuOpen(false)}>
              {item.name}
            </Link>
          ))}
          <div className='flex items-center space-x-3 pt-2'>
            <Link to='/auth/blog/userprofile'><FaCircleUser className='text-2xl hover:text-zinc-700'  /></Link>
            <Button buttonHandler={handleLogout} buttontext={'Logout'} icon={<FiLogOut className="text-xl text-white" />} />
          </div>
        </div>
      )}

      <div className='space-x-2 hidden md:flex'>
        <Link to='/auth/blog/userprofile'><div className="bg-black mt-1 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl font-semibold mr-3 hover:bg-zinc-700 cursor-pointer">
          {user.name.charAt(0).toUpperCase()}
        </div></Link>
        <Button buttonHandler={handleLogout} buttontext={'Logout'} icon={<FiLogOut className="text-xl text-white" />} />
      </div>
    </nav>
  )
}

export default Navbar