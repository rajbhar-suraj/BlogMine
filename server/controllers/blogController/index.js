const Blog = require('../../models/blogModel')

const createBlog = async (req, res) => {

    const title = req.body?.title;
    const content = req.body?.content;

    if (!title || !content) return res.status(400).json({ message: 'All fields are required' })
    try {
        const imagePath = req.file ? req.file.path : null;

        const post = new Blog({ title, content, image: imagePath, author: req.userId });
        await post.save()
        // ✅ Populate author before sending
        const populatedPost = await post.populate('author', 'name');
        res.status(200).json({ post: populatedPost, message: 'Blog created successfully' });
        
    } catch (error) {

        console.error("❌ Error creating blog:", error.message);
        console.error("🔍 Full error:", error); // Or error.stack
        res.status(500).json({ message: error.message || "Something went wrong" });


    }
}

const getAllBlog = async (req, res) => {
    try {
        const response = await Blog.find().populate('author', 'name').exec()
        res.status(200).json(response)
    } catch (error) {
        res.status(400).json({ message: 'Server issue', error: error })
    }
}

const getUserBlog = async (req, res) => {
    try {
        const userId = req.userId;
        const blogs = await Blog.find({ author: userId }).populate('author', 'name')
        res.status(200).json({ blogs })
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'failed to fetch your blog' })
    }
}

const editBlog = async (req, res) => {
    const blogId = req.params.id
    const { title, content } = req.body
    try {
        const updateData = { title, content };

        if (req.file) {
            updateData.image = req.file.path;
        }
        const blogEdit = await Blog.findByIdAndUpdate(blogId, updateData, { new: true })
        if (!blogEdit) return res.status(400).json({ message: 'Blog not found' })

        res.status(200).json({ message: 'Blog successfully edited' })
    } catch (error) {
        res.status(400).json({ message: 'something went wrong while editing' })
        console.log(error);
    }
}

const deleteBlog = async (req, res) => {
    const blogId = req.params.id;

    if (!blogId) {
        return res.status(400).json({ message: 'Blog ID is required' });
    }
    try {
        const delBlog = await Blog.findByIdAndDelete(req.params.id)
        if (!delBlog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.status(200).json({ message: 'deleted successfully' })
    } catch (error) {
        res.status(400).json({ message: 'delete went wrong', error })
    }
}

module.exports = { createBlog, getAllBlog, deleteBlog, editBlog, getUserBlog }