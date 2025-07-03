import { HiOutlineDotsVertical } from "react-icons/hi";
import { MdDelete, MdEdit, MdReport } from "react-icons/md";
import { useState } from "react";
import { useBlogContext } from "../contexts/blogContext/BlogContext";
import { useAuthContext } from "../contexts/userContext/AuthContext";
import ReportModal from "./ReportModal";

const CommentFeature = ({ c, blogId }) => {
    const { editComment, deleteComment } = useBlogContext();
    const { user } = useAuthContext();
    const currentUserId = user?._id;

    const isMyComment = c.user?._id?.toString() === currentUserId?.toString();

    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(c.text);
    const [showMenu, setShowMenu] = useState(false);
    const [isReportOpen, setIsReportOpen] = useState(false);
    const [reportBlog, setReportBlog] = useState(null);

    async function deleteHandler(id) {
        await deleteComment(blogId, id);
        setShowMenu(false);
    }

    async function handleSaveEdit() {
        if (!editText.trim()) return;
        await editComment(blogId, c._id, editText);
        setIsEditing(false);
        setShowMenu(false);
    }

    function handleReport(e) {
        e.stopPropagation();
        setIsReportOpen(true);
        setReportBlog(c._id); // or c if you want full object
        setShowMenu(false);
    }


    return (
        <div key={c._id} className="relative border-b py-1">
            <p className="text-xs text-gray-500 font-medium">
                {c.user?.name || "User"}
            </p>

            <div className="flex justify-between items-start gap-2">
                {isEditing ? (
                    <div className="flex flex-1">
                        <input
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="w-full focus:outline-none border-b transition"
                        />
                        <div className="flex justify-end gap-2 mt-1">
                            <button
                                onClick={handleSaveEdit}
                                className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="bg-black text-white px-2 py-1 rounded hover:bg-zinc-700"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-600 pr-2 break-words flex-1">
                        {c.text?.trim() || "..."}
                    </p>
                )}

                {!isEditing && (
                    <span
                        onClick={() => setShowMenu((prev) => !prev)}
                        className="text-gray-500 cursor-pointer"
                        title="Menu"
                    >
                        <HiOutlineDotsVertical />
                    </span>
                )}
            </div>

            {/* Dropdown Menu */}
            {showMenu && (
                <div className="absolute right-3 top-6 bg-white shadow-md border p-1 rounded-md z-10 flex flex-col">
                    {isMyComment ? (
                        <>
                            <button
                                className="flex items-center px-2 py-1 text-sm hover:bg-gray-100"
                                onClick={() => deleteHandler(c._id)}
                            >
                                <MdDelete className="mr-1" /> Delete
                            </button>
                            <button
                                onClick={() => {
                                    setIsEditing(true);
                                    setShowMenu(false);
                                }}
                                className="flex items-center px-2 py-1 text-sm hover:bg-gray-100"
                            >
                                <MdEdit className="mr-1" /> Edit
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleReport}
                            className="flex items-center px-2 py-1 text-sm hover:bg-gray-100 text-red-600"
                        >
                            <MdReport className="mr-1" /> Report
                        </button>
                    )}
                </div>
            )}
            {isReportOpen && (
                <ReportModal
                    type="comment"
                    itemId={reportBlog}
                    onClose={() => setIsReportOpen(false)}
                />
            )}
        </div>
    );
};

export default CommentFeature;
