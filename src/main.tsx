import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { RouterProvider, createHashRouter } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import { worker } from "@/api";

import { LoginRoute } from "@/feature/auth";
import { DashboardLayout } from "@/components/layout";
import { SchedulerRoute } from "@/feature/modules/scheduler";
import { UserManagementRoute } from "@/feature/modules/user-management";

const queryClient = new QueryClient();

worker.start();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider
        router={createHashRouter([
          { path: "/", element: <LoginRoute /> },
          {
            path: "/dashboard",
            element: <DashboardLayout />,
            children: [
              { path: "/dashboard/scheduler", element: <SchedulerRoute /> },
              {
                path: "/dashboard/user-management",
                element: <UserManagementRoute />,
              },
            ],
          },
        ])}
      />
    </QueryClientProvider>
  </React.StrictMode>
);
