const cloudinary = require('cloudinary').v2
const multer = require('multer')
const {CloudinaryStorage} = require('multer-storage-cloudinary')
require('dotenv').config()

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

const storage = new CloudinaryStorage({
    cloudinary : cloudinary,
    params : {
        folder:'blog_images',
        allowed_formats:['jpeg','png','jpg']
    }
})

const upload = multer({storage})

module.exports = {cloudinary,storage,upload}