import { JSX } from "react";
import { Navigate } from "react-router-dom";

export const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const isLoggedIn = sessionStorage.getItem("access_token");

  if (!isLoggedIn) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};
