import React, { useEffect, useState } from 'react'
import CommentForm from './CommentForm'
import { useBlogContext } from '../contexts/blogContext/BlogContext'
import { IoClose } from "react-icons/io5";
import { HiOutlineDotsVertical } from "react-icons/hi";
import CommentFeature from './CommentFeature';

const CommentsModal = ({ blog }) => {
    const { comments, showComment, setShowComment, fetchComment } = useBlogContext()
    const [showAll, setShowAll] = useState(false);
    const visibleComments = showAll ? comments : comments.slice(0, 3);


    useEffect(() => {
        if (!showComment) {
            fetchComment(blog._id); // Fetch only when viewing comments
        }
    }, [showComment]);
    useEffect(() => {
        const invalidComments = comments.filter(c => !c || !c._id);
        if (invalidComments.length > 0) {
          console.warn("Invalid comments detected:", invalidComments);
        }
      }, [comments]);
      

    function handleCancel() {
        setShowComment(true)
    }

    return (
        <div className="flex flex-col gap-4 pt-4 border-t">
        <div className='flex justify-end'>
            <IoClose className='text-2xl' onClick={handleCancel} />
        </div>
    
        <CommentForm blogId={blog._id}  />
    
        <h3 className="text-lg text-center hover:text-zinc-600 font-semibold">Comments</h3>
    
        {/* Scrollable Comments Box */}
        <div className="flex flex-col-reverse max-h-60 overflow-y-auto pr-2 gap-2">
            {visibleComments.length === 0 ? (
                <p className="text-gray-500">No comments yet.</p>
            ) : visibleComments.map(c => c && c._id ? <CommentFeature key={c._id} c={c} blogId={blog._id} /> : null)

            }
            
        </div>
        {comments.length > 3 && (
            <button
                onClick={() => setShowAll((prev) => !prev)}
                className="text-xs text-blue-600 hover:underline mt-1 self-start"
            >
                {showAll ? "Show less" : `View all ${comments.length} comments`}
            </button>
        )}
        {/* Toggle button placed OUTSIDE the scrollable container */}
        
    </div>
    
    
    )
}

export default CommentsModal