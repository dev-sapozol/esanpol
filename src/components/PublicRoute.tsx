import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { JSX } from "react";

interface PublicRouteProps {
  children: JSX.Element;
  redirectIfAuthenticated?: boolean;
  redirectTo?: string;
}

const PublicRoute = ({
  children,
  redirectIfAuthenticated = false,
  redirectTo = "/mail/#inbox",
}: PublicRouteProps) => {
  const { user, loading } = useUser();

  if (loading) return null;

  if (redirectIfAuthenticated && user) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default PublicRoute;
