import type { JSX } from "react";
import { Navigate } from "react-router";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) return <Navigate to="/sign-in" replace />;
  return children;
};

export default ProtectedRoute;
