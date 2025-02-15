"use client";

import { Button } from "@/components/ui/button";
import { ProjectAvatar } from "@/features/projects/_components/project-avatar";
import { useProjectId } from "@/features/projects/hooks/use-project-id";
import TaksViewSwitcher from "@/features/tasks/_components/taks-view-switcher";
import { Loader, PencilIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Navbar } from "@/components/navbar";
import { AnalyticsProject } from "@/features/projects/_components/analytics-project";
import { useProjects } from "@/features/api";

export const ProjectIdClient = () => {
  const projectId = useProjectId();
  const { data: project, isLoading: isLoadingProject } = useProjects().show({
    projectId,
  });
  const { data: analytics, isLoading: isLoadingAnalytics } =
    useProjects().analytics({ projectId });

  if (isLoadingProject || isLoadingAnalytics) {
    return (
      <div className="mx-3 flex flex-col gap-4">
        <Navbar
          isLoading={isLoadingProject || isLoadingAnalytics}
          breadcrumb={[
            {
              loading: "Workspace",
            },
            {
              loading: "Project",
            },
          ]}
        />
        <div className="h-[calc(100vh-128px)] flex items-center justify-center">
          <Loader className="size-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!project) {
    throw new Error("Not found");
  }

  return (
    <div className="mx-3 flex flex-col gap-4">
      <Navbar
        isLoading={isLoadingProject || isLoadingAnalytics}
        breadcrumb={[
          {
            href: `/workspaces/${project.workspaceId}`,
            label: project.workspace.name,
          },
          {
            label: project.name,
          },
        ]}
      />
      <div className="flex flex-col gap-4 w-full">
        <div className="flex items-center justify-between px-5 py-3 rounded-md border border-gray-300">
          <div className="flex items-center gap-2">
            <ProjectAvatar
              image={project.imageUrl}
              name={project.name}
              className={"size-8 shadow"}
            />
            <p className="text-lg font-semibold">{project.name}</p>
          </div>
          <div>
            <Button
              asChild
              size={"sm"}
              className="[&_svg]:size-3.5 bg-yellow-300 hover:bg-yellow-400 text-black"
            >
              <Link
                href={`/workspaces/${project.workspaceId}/projects/${project.$id}/settings`}
              >
                <PencilIcon />
                Edit Project
              </Link>
            </Button>
          </div>
        </div>
        <AnalyticsProject data={analytics} />
        <TaksViewSwitcher hideProject />
      </div>
    </div>
  );
};
