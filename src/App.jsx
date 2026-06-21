import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";
import HomeRedirect from "./routes/HomeRedirect";
import LoginPage from "./pages/LoginPage";
import FixturePage from "./pages/FixturePage";
import MatchDetailPage from "./pages/MatchDetailPage";
import MatchFormPage from "./pages/MatchFormPage";
import StatsPage from "./pages/StatsPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<HomeRedirect />} />

          <Route element={<RoleRoute allowedRoles={["common"]} />}>
            <Route path="/fixture" element={<FixturePage />} />
            <Route path="/matches/new" element={<MatchFormPage />} />
            <Route path="/matches/:id" element={<MatchDetailPage />} />
            <Route path="/matches/:id/edit" element={<MatchFormPage />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={["admin"]} />}>
            <Route path="/stats" element={<StatsPage />} />
          </Route>

          <Route path="/unauthorized" element={<UnauthorizedPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
