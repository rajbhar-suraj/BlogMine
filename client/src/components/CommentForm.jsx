import React, { useState } from 'react'
import { useBlogContext } from '../contexts/blogContext/BlogContext';
import Button from './Button';

const CommentForm = ({ blogId }) => {
    const { addComment, setShowComment } = useBlogContext()
    const [comment, setComment] = useState('')
    const [showButton, setShowButton] = useState(false)

    async function submitComment(e) {
        e.preventDefault()
        if (!comment.trim()) return
        await addComment(comment, blogId)
        setComment('')
        setShowButton(false)

    }
    function handleCancel() {
        setShowButton(false)
        setComment('')

    }

    return (
        <form onSubmit={submitComment} className="space-y-2">
            <div className="flex gap-4">

                <input
                    type="text"
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    onClick={() => setShowButton(true)}
                    placeholder="Write a comment..."
                    className="w-full border-b border-gray-400 focus:outline-none focus:border-blue-500 transition"
                />

                {
                    showButton &&
                    <div className='flex gap-3'>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white py-1 rounded px-8 hover:bg-blue-600 transition"

                        >
                            Add
                        </button>
                        <Button
                            type="button"
                            buttontext={"Cancel"}
                            buttonHandler={handleCancel} />
                    </div>
                }
            </div>
        </form>
    )
}


export default CommentForm