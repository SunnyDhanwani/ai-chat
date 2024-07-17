import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Onboarding from "../pages/Onboarding";
import PageNotFound from "../pages/PageNotFound";
import ProtectedRoute from "../utils/ProtectedRoute";
import Root from "../pages/Root";
import Chat from "../pages/Chat";
import SharedChat from "../pages/SharedChat";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    // index: true,
    children: [
      { path: "/", element: <Onboarding /> },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/chat",
            element: <Chat />,
          },
          {
            path: "/chat/:chatId",
            element: <Chat />,
          },
        ],
      },
      {
        path: "/shared-chat",
        element: <SharedChat />,
      },
    ],
  },
  { path: "*", element: <PageNotFound /> },
]);

export default router;
