const express = require('express');
const router = express.Router();
const { createBlog, getAllBlog, deleteBlog, editBlog, getUserBlog } = require('../../controllers/blogController');
const { middleWare } = require('../../controllers/userController');
const { storage } = require('../../config/cloudinary');

const multer = require('multer');
const { likeBlog, addComment, fetchComment, editComment,deleteComment, bookMark, getSavedBlogs } = require('../../controllers/blogController/features');
const upload = multer({ storage });

//blog
router.post('/create', middleWare, upload.single('image'), (req, res, next) => {
    console.log('🔥 Middleware & multer hit');
    next();
}, createBlog);
router.get('/getallblogs', getAllBlog)
router.get('/myblogs', middleWare, getUserBlog)
router.delete('/delete/:id', deleteBlog)
router.put('/edit/:id', upload.single('image'), (req, res, next) => {
    console.log('🔥 Middleware & multer hit');
    next()
}, editBlog)

//features
router.post('/:id/like',middleWare,likeBlog)
router.post('/addComment/:id',middleWare,addComment)
router.get('/fetchComment/:id',fetchComment)
// Edit Comment
router.put('/editComment/:blogId/:commentId', middleWare, editComment);

// Delete Comment
router.delete('/deleteComment/:blogId/:commentId', middleWare, deleteComment);

router.post('/bookmarks/:blogId',middleWare,bookMark)
router.get('/saved-blogs',middleWare,getSavedBlogs)

module.exports = router;





// const upload = multer({ dest: 'uploads/' }); // or configure with diskStorage


// router.post('/test', upload.single('image'), (req, res) => {
//     console.log('🔥 Upload Test Hit');
//     console.log('BODY:', req.body);
//     console.log('FILE:', req.file);
//     res.status(200).json({ msg: 'Upload test success' });
//   });
