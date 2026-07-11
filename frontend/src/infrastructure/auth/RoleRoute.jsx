import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "@features/auth/hooks/useAuthStore";

export default function RoleRoute({ allowedRoles }) {
  const user = useAuthStore((s) => s.user);
  if (!user) return <Navigate to="/login" replace />;
  return allowedRoles.includes(user.role) ? (
    <Outlet />
  ) : (
    <Navigate to="/unauthorized" replace />
  );
}
