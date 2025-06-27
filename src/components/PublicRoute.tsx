import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { JSX } from "react";

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useUser();

  if (loading) return null;

  return user ? <Navigate to="/mail/#inbox" replace /> : children;
};

export default PublicRoute;