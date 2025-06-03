import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom';
import Register from './pages/Register'
import Login from './pages/Login';
import { AuthProvider } from './contexts/userContext';
import CheckAuth from './components/CheckAuth';
import Dashboard from './pages/Dashboard';
import Blogs from './pages/Blogs';
import NotFound from './pages/NotFound';
import CreateBlog from './pages/CreateBlog';
import { BlogContextProvider } from './contexts/blogContext';
import BookMarks from './pages/BookMarks';
import { Toaster } from 'react-hot-toast';
import UserProfile from './components/UserProfile';


const App = () => {
  return (
    <div>
      <Toaster position="bottom-right" reverseOrder={false} />
      <AuthProvider>
        <BlogContextProvider>
          <Routes>

            {/* Public Routes */}

            {/* Protected Routes under /auth */}
            <Route path="/auth" element={<CheckAuth />}>
              <Route path="register" element={<Register />} />
              <Route path="login" element={<Login />} />

              {/* //own blogs -- dashboard */}
              <Route path="blog/dashboard" element={<Dashboard />} />
              <Route path="blog/create" element={<CreateBlog />} />
              {/* all blogs - blogs */}
              <Route path="blog/allblogs" element={<Blogs />} />
              <Route path='blog/bookmarks' element={<BookMarks />} />

              <Route path='blog/userprofile' element={<UserProfile />} />
            </Route>

            {/* Optional root redirect */}
            <Route path="/" element={<Navigate to="/auth/blog/dashboard" />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </BlogContextProvider>
      </AuthProvider>
    </div>
  )
}


export default App