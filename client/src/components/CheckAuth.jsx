import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthContext } from "../contexts/userContext/AuthContext";

function CheckAuth() {
  const { user, loading } = useAuthContext();
  const location = useLocation();
  
  const isAuthenticated = !!user;
  const path = location.pathname;

  // Define which routes are public
  const isPublicRoute = path === "/auth/login" || path === "/auth/register";


  if (loading) {
    return <div className="bg-black min-h-screen text-white flex justify-center items-center">Loading...</div>;
  }

  // ✅ If NOT logged in and trying to access protected routes
  if (!isAuthenticated && !isPublicRoute) {
    return <Navigate to="/auth/login" replace />;
  }
  

  // ✅ If logged in and trying to access login or register
  if (isAuthenticated && isPublicRoute) {
    return <Navigate to="/auth/blog/dashboard" replace />;
  }

  // ✅ Render the nested routes
  return <Outlet />;
}

export default CheckAuth;
