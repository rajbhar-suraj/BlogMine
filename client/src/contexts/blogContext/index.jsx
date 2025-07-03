import axios from 'axios';
import { BlogContext } from './BlogContext';
import { useEffect, useState } from 'react';
import { useAuthContext } from '../userContext/AuthContext';
import toast from 'react-hot-toast';
import axiosInstance from '../../api/axiosInstance';

export const BlogContextProvider = ({ children }) => {
    const { user } = useAuthContext()
    const [loading, setLoading] = useState(false);
    //explorepage
    const [blogs, setBlogs] = useState([])
    //dashboard
    const [userBlogs, setUserBlogs] = useState([])
    const [edited, setEdited] = useState(null)
    const [commentingOnBlogId, setCommentingOnBlogId] = useState(null);

    const [showComment, setShowComment] = useState(true)
    const [comments, setComments] = useState([])
    const [blogSave, setBlogSave] = useState([])
    const [savedBlogs, setSavedBlogs] = useState([]);
    const [likedBlogs, setLikedBlogs] = useState([]); // array of liked blog IDs
    const [selectedBlog, setSelectedBlog] = useState(null);


    const fetchUserBlogs = async () => {
        try {
            const res = await axiosInstance.get("/blog/myblogs");

            setUserBlogs(res.data.blogs);
        } catch (error) {
            console.error('❌ Error fetching user blogs:', error);
        }
    };
    const getAllBlogs = async () => {

        try {
            // const res = await axios.get('http://localhost:5000/auth/blog/getallblogs', { withCredentials: true })
            const res = await axiosInstance.get("/blog/getallblogs");

            setBlogs(res.data)
            setBlogs(res.data.filter(Boolean));

        } catch (error) {
            console.log("error", error);
        }
    }
    const refreshBlogs = async () => {
        await fetchUserBlogs();
        await getAllBlogs();
    };

    useEffect(() => {
        if (user) refreshBlogs();
    }, [user]);
    
    
    const createBlogs = async (formData) => {
        setLoading(true);
        try {
            const res = await axiosInstance.post("/blog/create", formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
              });
            await refreshBlogs(); // Instead of calling both separately
            await getAllBlogs()
            toast.success('Blog created successful!');

        } catch (error) {
            toast.error(err.response?.data?.message || 'Something went wrong');
        }finally {
            setLoading(false);
        }
    };

   
    const editBlog = async (formData, id) => {

        try {
            console.log("Form Data:", formData);
            console.log("ID to edit:", id);

            const res = await axiosInstance.put(`/blog/edit/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
              });
            await refreshBlogs(); // Instead of calling both separately
            setEdited(false)
            toast.success('Blog edited successful!');

        } catch (error) {
            toast.error(err.response?.data?.message || 'Something went wrong');
        } finally {
            setEdited(false)
        }
    }

    useEffect(() => {
        if (user?.savedBlogs) {
            setBlogSave(user.savedBlogs.map(id => id.toString()));
        }
    }, [user]);

    const deleteBlog = async (id) => {

        try {
            const res = await axiosInstance.delete(`/blog/delete/${id}`);
            await getAllBlogs()
            refreshBlogs()
            toast.success('Blog deleted successful!');
        } catch (error) {
            toast.error(err.response?.data?.message || 'Something went wrong');
        }
    }



    useEffect(() => {
        if (user?.likedBlogs) {
            setLikedBlogs(user.likedBlogs.map(id => id.toString()));
        }
    }, [user]);

    const likeBlogsDashboard = async (blogId) => {
        if (!user || !user._id) {
            alert("Please login to like.");
            return;
        }

        try {
            const res = await axiosInstance.post(`/blog/${blogId}/like`);
            const updatedBlog = res.data.updatedBlog;

            // Preserve the author field from old blog if updated one is missing it
            setBlogs(prevBlogs =>
                prevBlogs.map(blog =>
                    blog._id === blogId
                        ? {
                            ...updatedBlog,
                            author: blog.author, // Preserve original author object
                        }
                        : blog
                )
            );

            setUserBlogs(prevBlogs =>
                prevBlogs.map(blog =>
                    blog._id === blogId
                        ? {
                            ...updatedBlog,
                            author: blog.author,
                        }
                        : blog
                )
            );
            if (selectedBlog?._id === blogId) {
                setSelectedBlog(prev => ({
                  ...updatedBlog,
                  author: prev.author // Preserve the author info
                }));
              }
          
        } catch (error) {
            console.error('Error liking blog:', error);
        }
    };

    //features pending
    const likeBlogs = async (id) => {
        if (!user || !user._id) {
            console.log("❌ User not found or not logged in");
            return;
        }
    
        try {
            const res = await axiosInstance.post(`/blog/${id}/like`);
            const { updatedBlog } = res.data;
    
            // ✅ Update explore blogs
            setBlogs(prevBlogs =>
                prevBlogs.map(blog =>
                    blog._id === id ? { ...updatedBlog, author: blog.author } : blog
                )
            );
    
            // ✅ Update user-specific blogs
            setUserBlogs(prevBlogs =>
                prevBlogs.map(blog =>
                    blog._id === id ? { ...updatedBlog, author: blog.author } : blog
                )
            );
    
            // ✅ Update modal blog if it's the same
            if (selectedBlog && selectedBlog._id === id) {
                setSelectedBlog({ ...updatedBlog, author: selectedBlog.author });
            }
    
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };
    
      
   
    const fetchComment = async (id) => {
        console.log("📨 Fetching comments for blog id:", id);
        try {
            const res = await axiosInstance.get(`/blog/fetchComment/${id}`);

          const validComments = res.data.filter(c => c && c._id);
          console.log("✅ Valid comments fetched:", validComments);
          setComments(validComments);
          return validComments;  // Important for local state
        } catch (error) {
          console.error("❌ Error fetching comments:", error.message);
          return [];
        }
      };

      
    const addComment = async (comment, id) => {

        const text = comment
        try {
            const res = await axiosInstance.post(`/blog/addComment/${id}`, { text });
            const updatedComments = res.data.comments; // ✅ Make sure your backend returns all comments
            // Update comments state immediately
            if (updatedComments) {
                setComments(updatedComments);
            }
            toast.success('Comment added successfully!');

        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong');
        }
    }

    const editComment = async (blogId, commentId, newText) => {
        try {
            const res = await axiosInstance.put(`/blog/editComment/${blogId}/${commentId}`, { text: newText });

            setComments(prev =>
                prev.map(comment =>
                    comment._id === commentId ? { ...comment, text: newText } : comment
                )
            );


        } catch (error) {
            console.error("Edit Error:", error.message);
        }
    };

    const deleteComment = async (blogId, commentId) => {
        try {
            const res = await axiosInstance.delete(`/blog/deleteComment/${blogId}/${commentId}`);

            setComments(prevComments => prevComments.filter(c => c._id !== commentId));

            // fetchComment(id)
            // Optional: show a toast or reload comments
            toast.success('Comment deleted successfully!');

        } catch (error) {
            toast.error(err.response?.data?.message || 'Something went wrong');
        }
    };

    const bookMarks = async (blogId) => {

        try {
            const res = await axiosInstance.post(`/blog/bookmarks/${blogId}`);

            const { blogId: returnedBlogId, bookmarked } = res.data;

            // ✅ update blogSave immediately
            setBlogSave(prev => {
                if (!Array.isArray(prev)) prev = [];

                if (bookmarked) {
                    // Add blogId to blogSave
                    if (!prev.includes(returnedBlogId)) {
                        return [...prev, returnedBlogId];
                    }
                    return prev;
                } else {
                    // Remove blogId from blogSave
                    return prev.filter(id => id !== returnedBlogId);
                }
            });

            console.log('log',res.data.message);
            if (res.data.message === 'Saved') {
                toast.success('Saved successfully!');
            }else{
                toast.success('Saved unsuccessfully!');
            }
            return res.data;

        } catch (error) {
            toast.error(err.response?.data?.message || 'Something went wrong');
        }
    }

    const fetchSavedBlogs = async () => {
        try {
            const res = await axiosInstance.get("/blog/saved-blogs");
            setSavedBlogs(res.data.savedBlogs);
        } catch (error) {
            console.error('Failed to fetch saved blogs', error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        const fetchUserBlogs = async () => {
            try {
                const res = await axiosInstance.get("/blog/myblogs");

                console.log("📡 Response from backend:", res.data.blogs); // 👈 Check this output
                setUserBlogs(res.data.blogs);
            } catch (error) {
                console.error('❌ Error fetching user blogs:', error);
            }
        };
        if (user) fetchUserBlogs();
        if (user) getAllBlogs();

    }, [user]);

    useEffect(() => {
        if (selectedBlog?._id && showComment === false) {
            fetchComment(selectedBlog._id);
        }
    }, [selectedBlog, showComment]);

    const value = {
        selectedBlog, setSelectedBlog,
        likeBlogsDashboard, likedBlogs, savedBlogs,
        setSavedBlogs, fetchSavedBlogs, blogSave,
        setBlogSave, bookMarks, commentingOnBlogId,
        setCommentingOnBlogId, deleteComment, editComment,
        comments, setComments, showComment, setShowComment,
        addComment, fetchComment, likeBlogs, deleteBlog,
        editBlog, getAllBlogs,
        createBlogs, loading, setLoading, edited,
        setEdited, blogs, setBlogs,
        userBlogs, setUserBlogs
    }
    return (
        <BlogContext.Provider value={value}>
            {children}
        </BlogContext.Provider>
    );
};
// showComment === true	Show icons (like, comment, bookmark)
// showComment === false	Show comment list + CommentForm only
// Close Comments Button	Toggles back to icons
// fetchComment(blog._id)	Called only when showing comments