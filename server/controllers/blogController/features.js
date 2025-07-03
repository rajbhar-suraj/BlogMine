const Blog = require('../../models/blogModel')
const User = require('../../models/usermodel')

const likeBlog = async (req, res) => {
    const userId = req.userId //from middleware
    const blogId = req.params.id

    try {
        const blog = await Blog.findById(blogId)
        .populate('author', 'name'); // 👈 this adds full author object with name
              
        if (!blog) return res.status(400).json({ message: 'blog not found...' })
        const alreadyLiked = blog.likes.find(like => like.user.toString() === userId)

        if (alreadyLiked) {
            blog.likes = blog.likes.filter(like => like.user.toString() !== userId)
        } else {
            blog.likes.push({ user: userId })
        }
        const updatedBlog = await blog.save();

        res.status(200).json({ updatedBlog: updatedBlog });
    
    } catch (error) {
        res.status(400).json({ message: 'something went wrong' })
    }
}

const bookMark = async (req, res) => {
    const userId = req.userId;
    const blogId = req.params.blogId;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(400).json({ message: 'User not found' });

        const blog = await Blog.findById(blogId).populate('author', 'name');

        if (!blog) return res.status(400).json({ message: 'Blog not found' });

        // Check if user already bookmarked the blog
        const alreadySaved = user.savedBlogs.some(id => id.toString() === blogId);

        if (alreadySaved) {
            // Remove blogId from user's savedBlogs
            user.savedBlogs = user.savedBlogs.filter(id => id && id.toString() !== blogId);

            // Remove userId from blog's bookmarks
            blog.bookmarks = blog.bookmarks.filter(bm => bm.user && bm.user.toString() !== userId);
        } else {
            // Add blogId to user's savedBlogs
            user.savedBlogs.push(blogId);

            // Add userId to blog's bookmarks
            blog.bookmarks.push({ user: userId });
        }

        await user.save();
        await blog.save();

        const savedBlogIds = user.savedBlogs.map(id => id.toString());

        res.status(200).json({
            message: alreadySaved ? 'UnSaved' : 'Saved',
            blogId,
            bookmarked: !alreadySaved,
            savedBlogIds,
            updatedBlog: blog,
          });
          

    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Something went wrong' });
    }
};


const getSavedBlogs = async (req, res) => {
    const userId = req.userId;
    try {
        // Populate savedBlogs, and inside each blog populate the 'author' field with 'name'
        const user = await User.findById(userId).populate({
            path: 'savedBlogs',
            populate: {
                path: 'author',
                select: 'name'
            }
        });

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ savedBlogs: user.savedBlogs });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};



// const bookMark = async (req, res) => {
//     const userId = req.userId;
//     const blogId = req.params.blogId;
//     console.log("reached");
//     try {
//         // 🟢 After blog.save(), update the user's savedBlogs
//         const user = await User.findById(userId);
//         if (!user) return res.status(400).json({ message: 'User not found' });

//         const blog = await Blog.findById(blogId)
//         if (!blog) return res.status(400).json({ message: 'blog not found...' })

//         const populating = await User.findById(userId).populate('savedBlogs');
//         console.log(populating);
//         const alreadySaved = user.savedBlogs.some(id => id.toString() === blogId);
//         console.log('saved', alreadySaved);
//         if (alreadySaved) {
//             user.savedBlogs = user.savedBlogs.filter(id => id.toString() !== blogId);
//             console.log(user.savedBlogs);
//         } else {
//             user.savedBlogs.push(blogId);
//         }

//         await user.save();

//         const savedBlogIds = user.savedBlogs.map(id => id.toString());

//         res.status(200).json({
//             message: alreadySaved ? 'UnSaved' : 'Saved',
//             blogId,
//             bookmarked: !alreadySaved,
//             savedBlogIds
//         });


//     } catch (err) {
//         res.status(400).json({ message: 'Something went wrong' });
//     }
// };


// const fetchComment
const fetchComment = async (req, res) => {
    const blogId = req.params.id
    try {
        const blog = await Blog.findById(blogId).populate('comments.user', 'name')
        if (!blog) return res.status(400).json({ message: 'blog not found...' })
        res.status(200).json(blog.comments)

    } catch (error) {
        res.status(400).json({ message: 'something went wrong' })
    }
}

const addComment = async (req, res) => {

    const userId = req.userId;
    const blogId = req.params.id
    const { text } = req.body
    if (!text || text.trim() === "") {
        return res.status(400).json({ message: "Comment text is required" });
    }

    try {
        const blog = await Blog.findById(blogId)
        if (!blog) return res.status(400).json({ message: 'blog not found...' })
        const newComment = {
            text,
            user: userId,
            createdAt: new Date()
        };
        blog.comments.push(newComment)
        await blog.save()

        const updatedBlog = await Blog.findById(blogId).populate('comments.user', 'name');

        res.status(200).json({ message: 'comment added successfully', comments: updatedBlog.comments })

    } catch (error) {
        console.error('Add Comment Error:', error);
        res.status(400).json({ message: 'error adding comment' });
    }

}

// Edit Comment
const editComment = async (req, res) => {
    const { blogId, commentId } = req.params;
    const { text } = req.body;
    const userId = req.userId;

    try {
        const blog = await Blog.findById(blogId);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });

        const comment = blog.comments.id(commentId);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        if (comment.user.toString() !== userId)
            return res.status(403).json({ message: 'Unauthorized' });

        comment.text = text;
        await blog.save();

        return res.status(200).json({ message: 'Comment updated successfully', comment });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};

// Delete Comment
const deleteComment = async (req, res) => {
    const { blogId, commentId } = req.params;
    const userId = req.userId;

    try {
        const blog = await Blog.findById(blogId);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });


        const comment = blog.comments.id(commentId);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });


        if (comment.user.toString() !== userId)
            return res.status(403).json({ message: 'Unauthorized' });

        comment.deleteOne();
        await blog.save();

        return res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error("Error deleting comment:", error.message);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getSavedBlogs, bookMark, likeBlog, addComment, fetchComment, editComment, deleteComment }