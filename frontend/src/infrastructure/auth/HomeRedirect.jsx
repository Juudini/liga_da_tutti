import { Navigate } from "react-router-dom";
import useAuthStore from "@features/auth/hooks/useAuthStore";

export default function HomeRedirect() {
  const isAdmin = useAuthStore((s) => s.isAdmin);
  return <Navigate to={isAdmin ? "/stats" : "/fixture"} replace />;
}
