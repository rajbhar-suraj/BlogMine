const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const UserRoute = require('./routes/userRoute')
const BlogRoute = require('./routes/blogRoute')
const ReportRoute = require('./routes/ReportRoute')
const path = require('path')

const cookieParser = require('cookie-parser')

const connectDb = require('./config/db')
dotenv.config()
connectDb()
const app = express()

app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())


app.use('/uploads', express.static('uploads'));

app.use('/auth', UserRoute)
app.use('/auth/blog', BlogRoute)
app.use('/auth/blog/comment', ReportRoute)

if (process.env.NODE_ENV === "production") {
  const path = require('path');
  app.use(express.static(path.join(__dirname, "../client/dist"))); // Serve Vite build

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  });
}


const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server is running on ${PORT}`))