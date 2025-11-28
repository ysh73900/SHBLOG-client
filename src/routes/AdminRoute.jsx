import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const { isLoggedIn, role, isAuthInitialized } = useSelector(
    (state) => state.auth
  );

  if (!isAuthInitialized) return null;

  if (!isLoggedIn || role !== "ROLE_ADMIN") {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export default AdminRoute;
