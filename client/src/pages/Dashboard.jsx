import React, { useState, useEffect } from 'react'
import Navbar from '../components/NavBar';
import { Link, useNavigate } from 'react-router-dom';
import { GiTreehouse } from "react-icons/gi";
import { useBlogContext } from '../contexts/blogContext/BlogContext';
import Card from '../components/Card';
import Button from '../components/Button';
import { MdEdit } from "react-icons/md"
import { MdDelete } from "react-icons/md";
import BlogModal from '../components/BlogModal';
import { useAuthContext } from '../contexts/userContext/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const { userBlogs, likeBlogs, selectedBlog, setSelectedBlog, deleteBlog, likeBlogsDashboard, setEdited, blogSave, setBlogs } = useBlogContext();

  const { user } = useAuthContext();
  const navigate = useNavigate()

  async function editHandler(e, blog) {
    e.stopPropagation();
    setEdited(blog);
    navigate('/auth/blog/create');
  }

  async function deleteHandler(e, id) {
    e.stopPropagation();
    await deleteBlog(id);
  }

  useEffect(() => {
    console.log("📦 userBlogs:", userBlogs);
  }, [userBlogs]);

  return (

    <div>
    <Navbar />
  
    {Array.isArray(userBlogs) && userBlogs.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4">
        {userBlogs.map((blog) => (
          <div
            key={blog._id}
            onClick={() => setSelectedBlog(blog)}
            className="bg-white rounded-xl shadow-md p-4 w-full h-full flex flex-col justify-between"
          >
            <Card
              blog={blog}
              onLike={() => likeBlogsDashboard(blog._id)}
              isSaved={blogSave?.includes(blog._id.toString())}
            />
            <div className="flex justify-end space-x-3 mt-4">
              <Button
                buttontext={"Edit"}
                buttonHandler={(e) => editHandler(e, blog)}
                icon={<MdEdit className="text-xl" />}
              />
  
              <Button
                buttontext={"Delete"}
                buttonHandler={(e) => deleteHandler(e, blog._id)}
                icon={<MdDelete className="text-xl" />}
              />
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="flex flex-col justify-center items-center min-h-screen w-full text-center px-4">
        <div className="flex items-center justify-center">
          <GiTreehouse className="text-6xl sm:text-8xl md:text-9xl text-gray-500 mb-4" />
        </div>
        <h1 className="text-2xl font-light mb-4">Share your journey, experiences...</h1>
  
        <Link to="/auth/blog/create">
          <button className="bg-black rounded-md text-white px-6 py-2 hover:bg-gray-700 mb-6">
            Create
          </button>
        </Link>
      </div>
    )}
  
    {selectedBlog && (
      <BlogModal
        blog={selectedBlog}
        onClose={() => setSelectedBlog(null)}
        onLike={likeBlogsDashboard} // ✅ Fix here
      />
    )}
  </div>
  
  )
}

export default Dashboard