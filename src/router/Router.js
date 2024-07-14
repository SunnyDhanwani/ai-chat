import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Onboarding from "../pages/Onboarding";
import PageNotFound from "../pages/PageNotFound";
import ProtectedRoute from "../utils/ProtectedRoute";
import Root from "../pages/Root";
import Chat from "../pages/Chat";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    // index: true,
    children: [
      { path: "/", element: <Onboarding /> },
      {
        element: <ProtectedRoute role="user" />,
        children: [
          {
            path: "/chat",
            element: <Chat />,
          },
        ],
      },
    ],
  },

  { path: "*", element: <PageNotFound /> },
]);

export default router;
