import React, { useState, useEffect } from 'react';
import { IoClose } from "react-icons/io5";
import { CiBookmark, CiHeart } from "react-icons/ci";
import { FaBookmark, FaRegComment, FaHeart } from "react-icons/fa";
import { useBlogContext } from '../contexts/blogContext/BlogContext';
import { useAuthContext } from '../contexts/userContext/AuthContext';
import CommentsModal from './CommentsModal';

const BlogModal = ({ blog, onClose, onLike }) => {
  const {
    fetchComment,
    showComment,
    setShowComment,
    bookMarks,
    blogSave,
    setBlogSave,
  } = useBlogContext();

  const { user } = useAuthContext();
  
  const [localBlog, setLocalBlog] = useState(blog); // ✅ new local blog state
  const [localComments, setLocalComments] = useState([]);
  const [localCommentCount, setLocalCommentCount] = useState(0);

  // ✅ Sync prop with local state if prop blog updates
  useEffect(() => {
    setLocalBlog(blog);
  }, [blog]);

  const hasLiked = localBlog.likes?.some(
    (like) => like.user === user?._id || like.user?._id === user?._id
  );

  const handleLike = async (e) => {
    e.stopPropagation();
    if (typeof onLike !== 'function') return;

    const res = await onLike(localBlog._id);
    if (res && res.updatedBlog) {
      setLocalBlog((prev) => ({
        ...res.updatedBlog,
        author: prev.author, // ensure author is preserved
      }));
    }
  };

  const bookMarkHandler = async (e) => {
    e.stopPropagation();
    const res = await bookMarks(localBlog._id);
    if (!res) return;
    const { blogId, bookmarked } = res;
    setBlogSave((prev) =>
      bookmarked
        ? [...new Set([...prev, blogId.toString()])]
        : prev.filter((savedId) => savedId !== blogId.toString())
    );
  };

  const isBlogSaved = blogSave?.includes(localBlog._id.toString());

  const formattedDate = new Date(localBlog.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  useEffect(() => {
    fetchComment(localBlog._id).then((commentsData) => {
      setLocalComments(commentsData || []);
      setLocalCommentCount(commentsData?.length || 0);
    });
  }, [localBlog._id]);

  if (!localBlog) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-7 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] relative flex flex-col">
        <button onClick={() => { onClose(); setShowComment(true); }} className="absolute top-2 right-0.5">
          <IoClose className='text-3xl' />
        </button>

        <div className="overflow-y-auto pr-2 space-y-4" style={{ maxHeight: '80vh' }}>
          <img src={localBlog.image} alt={localBlog.title} className="w-full ml-1 max-h-80 object-cover rounded-md" />
          <h2 className="text-2xl font-bold mt-4">{localBlog.title}</h2>

          {showComment ? (
            <>
              <p className="text-gray-700 mt-2">{localBlog.content}</p>
              <div className='flex justify-between'>
                <p className="text-sm text-gray-500 mt-4">Author: {localBlog.author?.name}</p>
                <span className='mt-3'>{formattedDate}</span>
              </div>
            </>
          ) : (
            <CommentsModal blog={blog} />
          )}
        </div>

        {showComment && (
          <div className="flex justify-around mt-4 pt-4 border-t">
            <button onClick={handleLike} className="flex items-center gap-1 text-red-500 hover:scale-110 transition">
              {hasLiked ? <FaHeart className="text-2xl" /> : <CiHeart className="text-2xl" />}
              {localBlog.likes?.length || ''}
            </button>

            <button
              onClick={() => setShowComment(false)}
              className="flex items-center gap-1 text-blue-500 hover:scale-110 transition"
            >
              <FaRegComment className="text-2xl" />     {console.log("🧮 Displayed comment count for blog", blog._id, ":", localCommentCount)}
              {localCommentCount || ''}
            </button>

            {typeof isBlogSaved === 'boolean' && (
              <button onClick={bookMarkHandler} className="flex items-center gap-1 text-yellow-600 hover:scale-110 transition">
                {isBlogSaved ? <FaBookmark className="text-2xl text-yellow-600" /> : <CiBookmark className="text-2xl text-yellow-500" />}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};


export default BlogModal;
