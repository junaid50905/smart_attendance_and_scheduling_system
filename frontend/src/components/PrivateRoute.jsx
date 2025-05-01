import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const token = localStorage.getItem("token"); // or whatever you use to verify auth

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
