const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const UserRoute = require('./routes/userRoute')
const BlogRoute = require('./routes/blogRoute')
const ReportRoute = require('./routes/ReportRoute')

const cookieParser = require('cookie-parser')

const connectDb = require('./config/db')
dotenv.config()
connectDb()
const app = express()
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser())
app.use(cors({
    origin: ['http://localhost:5173', 'https://blog-mine-three.vercel.app'],
    credentials : true
}))
app.use(express.json()); // ⬅️ This is required for JSON body parsing


app.use('/uploads', express.static('uploads'));

app.use('/auth',UserRoute)
app.use('/auth/blog',BlogRoute)
app.use('/auth/blog/comment',ReportRoute)


const PORT = process.env.PORT || 5000

app.listen(PORT,()=>console.log(`Server is running on ${PORT}`))