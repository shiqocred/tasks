"use client";

import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Navbar } from "@/components/navbar";
import TaksViewSwitcher from "@/features/tasks/_components/taks-view-switcher";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { Loader } from "lucide-react";

export const TaskClient = () => {
  const workspaceId = useWorkspaceId();

  const { data, isLoading } = useGetWorkspace({ workspaceId });

  if (isLoading) {
    return (
      <div className="mx-3 flex flex-col gap-4">
        <Navbar
          isLoading={isLoading}
          breadcrumb={[
            {
              loading: "Workspace",
            },
            {
              loading: "Tasks",
            },
          ]}
        />
        <div className="h-[calc(100vh-128px-16px-74px)] flex items-center justify-center">
          <Loader className="size-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!data) {
    throw new Error("Workspace not found");
  }

  return (
    <div className="mx-3 flex flex-col gap-4">
      <Navbar
        isLoading={isLoading}
        breadcrumb={[
          {
            href: `/workspaces/${workspaceId}`,
            label: data.name,
          },
          {
            label: "Tasks",
          },
        ]}
      />
      <TaksViewSwitcher isTasks />
    </div>
  );
};
