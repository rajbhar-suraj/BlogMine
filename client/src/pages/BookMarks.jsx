import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import Card from '../components/Card';
import { useBlogContext } from '../contexts/blogContext/BlogContext';
import { useAuthContext } from '../contexts/userContext/AuthContext';
import { useNavigate } from 'react-router-dom';  // import this at the top

const BookMarks = () => {
  const { savedBlogs, fetchSavedBlogs, likeBlogsDashboard, blogSave } = useBlogContext();
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      await fetchSavedBlogs();
      setLoading(false);
    };
    fetchData();
  }, [fetchSavedBlogs]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 text-lg">
        Loading saved blogs...
      </div>
    );

  if (savedBlogs.length === 0)
    return (
      <div className="flex flex-col justify-center items-center h-screen text-gray-600 px-4">
        <div className="text-6xl mb-4 select-none">📭</div>
        <h2 className="text-2xl font-semibold mb-2">No saved blogs yet</h2>
        <p className="text-center max-w-sm">
          You haven't saved any blogs yet. Browse the blog section and save your favorite posts to see them here.
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition"
        >
          Back to Dashboard
        </button>
      </div>
    );

  return (
    <div>
      <NavBar />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4 py-6">
        {savedBlogs.map((blog) => (
          <div
            key={blog._id}
            className="bg-white rounded-xl shadow-md p-4 w-full h-full flex flex-col justify-between"
          >
            <Card
              blog={blog}
              onLike={() => likeBlogsDashboard(blog._id)}
              isSaved={blogSave?.includes(blog._id.toString())}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookMarks;
