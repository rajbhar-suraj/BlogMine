import React, { useState } from 'react'
import Navbar from '../components/NavBar';
import { useBlogContext } from '../contexts/blogContext/BlogContext';
import Card from '../components/Card';
import BlogModal from '../components/BlogModal';
import { useAuthContext } from '../contexts/userContext/AuthContext';

const Blogs = () => {
  const { blogs, blogSave, likeBlogs } = useBlogContext();
  const [selectedBlog, setSelectedBlog] = useState(null);
  const { user } = useAuthContext();

  return (
    <div className=''>
      <Navbar />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4">
        {blogs.filter(Boolean).map((blog) => {
          const isSaved = blogSave?.includes(blog._id.toString());

          return (
            <div
              key={blog._id}
              onClick={() => setSelectedBlog(blog)}
              className="bg-white rounded-xl shadow-md p-4"
            >
              <Card
                blog={blog}
                isSaved={isSaved}
                onLike={() => likeBlogs(blog._id)} // ✅ use correct context function
              />
            </div>
          );
        })}

        {selectedBlog && (
          <BlogModal
            blog={selectedBlog}
            onClose={() => setSelectedBlog(null)}
            onLike={likeBlogs} // ✅ same here
          />
        )}
      </div>
    </div>
  );
};

export default Blogs;
