import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function HomeRedirect() {
  const { isAdmin } = useAuth();
  return <Navigate to={isAdmin ? "/stats" : "/fixture"} replace />;
}
