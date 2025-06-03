import React, { useState, useEffect } from 'react';
import { useBlogContext } from '../contexts/blogContext/BlogContext';
import { CiBookmark, CiHeart } from 'react-icons/ci';
import { FaBookmark, FaHeart } from 'react-icons/fa';
import { useAuthContext } from '../contexts/userContext/AuthContext';

const Card = ({ blog, isSaved, onLike }) => {
  const { likeBlogs, bookMarks, setBlogSave, likedBlogs, setSavedBlogs, savedBlogs } = useBlogContext();
  const likes = blog.likes || [];


  const { user } = useAuthContext();

  const formattedDate = new Date(blog.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const hasLiked = likes.some(like => {
    if (typeof like === 'string') return like === user?._id;
    if (like.user) return like.user === user?._id || like.user._id === user?._id;
    return false;
  });

  async function bookMarkHandler(e) {
    e.stopPropagation(); // ✅ prevent modal open
    if (!user) return alert("Login to bookmark.");

    const res = await bookMarks(blog._id);

    if (res?.updatedBlog) {
      setSavedBlogs(prev =>
        prev.map(blog =>
          blog._id === res.updatedBlog._id ? res.updatedBlog : blog
        )
      );
    }
    console.log('saved', savedBlogs);

  }
  return (
    <div className="cursor-pointer flex flex-col h-full">
      <img
        src={blog.image}
        alt={blog.title}
        className="rounded-md h-48 w-full object-cover"
      />
      <div className="flex-grow mt-2">
        <h2 className="text-xl font-semibold">{blog.title.slice(0, 33)}...</h2>
        <p className="text-sm text-gray-600 mt-2">{blog.content.slice(0, 100)}...</p>
      </div>

      <div className="text-xs text-gray-400 mt-2 flex justify-between items-center border-t pt-2">

        <span className=''>Author: {blog?.author?.name || "Unknown"}</span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onLike(blog._id);
          }}
          className="flex items-center gap-1 text-red-500 hover:scale-110 transition"
          style={{ width: '3.5rem', justifyContent: 'center' }} // fixed width here
        >
          {hasLiked ? <FaHeart className="text-2xl" /> : <CiHeart className="text-2xl" />}
          <span>{likes.length || ""}</span>
        </button>

        {typeof isSaved === 'boolean' && (
          <button
            onClick={(e) => bookMarkHandler(e)}
            className="flex items-center gap-1 text-yellow-600 hover:scale-110 transition"
            style={{ width: '1.5rem', height: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {isSaved
              ? <FaBookmark className="w-6 h-6 text-yellow-600" />
              : <CiBookmark className="w-6 h-6 text-yellow-500" />
            }
          </button>
        )}

        <span>{formattedDate}</span>



      </div>
    </div>
  );
};

export default Card;