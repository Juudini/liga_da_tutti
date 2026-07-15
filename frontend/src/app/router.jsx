import { createBrowserRouter, Outlet } from "react-router-dom";
import Layout from "@shared/components/layout/Layout";
import ProtectedRoute from "@infrastructure/auth/ProtectedRoute";
import RoleRoute from "@infrastructure/auth/RoleRoute";
import HomeRedirect from "@infrastructure/auth/HomeRedirect";
import Auth from "@features/auth/Auth";
import Register from "@features/auth/Register";
import Matches from "@features/matches/Matches";
import MatchDetail from "@features/matches/components/MatchDetail";
import MatchForm from "@features/matches/components/MatchForm";
import Teams from "@features/teams/Teams";
import Tournaments from "@features/tournaments/Tournaments";
import TournamentMatches from "@features/tournaments/TournamentMatches";
import Stats from "@features/stats/Stats";
import UnauthorizedPage from "./UnauthorizedPage";
import NotFoundPage from "./NotFoundPage";
import RouteErrorBoundary from "@shared/components/RouteErrorBoundary";

const router = createBrowserRouter([
  {
    element: <Outlet />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { path: "/login", element: <Auth /> },
      { path: "/register", element: <Register /> },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <Layout />,
            children: [
              { path: "/", element: <HomeRedirect /> },

              {
                element: <RoleRoute allowedRoles={["common"]} />,
                children: [
                  { path: "/fixture", element: <Matches /> },
                  { path: "/matches/new", element: <MatchForm /> },
                  { path: "/matches/:id", element: <MatchDetail /> },
                  { path: "/matches/:id/edit", element: <MatchForm /> },
                  {
                    path: "/tournaments/:id/matches",
                    element: <TournamentMatches />,
                  },
                ],
              },

              {
                element: <RoleRoute allowedRoles={["common", "admin"]} />,
                children: [
                  { path: "/teams", element: <Teams /> },
                  { path: "/tournaments", element: <Tournaments /> },
                ],
              },

              {
                element: <RoleRoute allowedRoles={["admin"]} />,
                children: [{ path: "/stats", element: <Stats /> }],
              },

              { path: "/unauthorized", element: <UnauthorizedPage /> },
            ],
          },
        ],
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

export default router;
