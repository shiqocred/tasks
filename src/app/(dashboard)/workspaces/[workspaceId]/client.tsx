"use client";

import { MemberAvatar } from "@/components/member-avatar";
import { Navbar } from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ProjectAvatar } from "@/features/projects/_components/project-avatar";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";
import { useCreateTaskModal } from "@/features/tasks/hooks/use-create-task-modal";
import { TaskType } from "@/features/tasks/server/types";
import { AnalyticsWorkspace } from "@/features/workspaces/_components/analytics-workspace";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useGetWorkspaceAnalytics } from "@/features/workspaces/api/use-get-workspace-analytics";
import { useGetWorkspaceDashboard } from "@/features/workspaces/api/use-get-workspace-dashboard";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { formatDistanceStrict } from "date-fns";
import { CalendarIcon, Loader, Plus, Settings } from "lucide-react";
import Link from "next/link";
import React, { ReactNode } from "react";

export const WorkspaceIdClient = () => {
  const workspaceId = useWorkspaceId();

  const { data: workspace, isLoading: isLoadingWorkspace } = useGetWorkspace({
    workspaceId,
  });
  const { data: analytics, isLoading: isLoadingAnalytics } =
    useGetWorkspaceAnalytics({ workspaceId });
  const { data: dashboard, isLoading: isLoadingDashboard } =
    useGetWorkspaceDashboard({ workspaceId });

  const { open: createProject } = useCreateProjectModal();
  const { open: createTask } = useCreateTaskModal();

  if (isLoadingAnalytics || isLoadingDashboard || isLoadingWorkspace) {
    return (
      <div className="mx-3 flex flex-col gap-4">
        <Navbar
          isLoading={isLoadingAnalytics || isLoadingDashboard}
          breadcrumb={[
            {
              loading: "Workspace",
            },
          ]}
        />
        <div className="h-[calc(100vh-128px-16px-74px)] flex items-center justify-center">
          <Loader className="size-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!workspace || !analytics || !dashboard) {
    throw new Error("Workspace not found");
  }

  return (
    <div className="mx-3 flex flex-col gap-4">
      <Navbar
        isLoading={isLoadingAnalytics || isLoadingDashboard}
        breadcrumb={[
          {
            href: `/workspaces/${workspaceId}`,
            label: workspace.name,
          },
        ]}
      />
      <AnalyticsWorkspace data={analytics} />
      <div className="flex flex-col-reverse lg:flex-row gap-4">
        <div className="flex flex-col gap-4 w-full">
          <div className="w-full rounded-lg bg-neutral-100 border border-neutral-100 p-4 gap-4 flex flex-col">
            <HeaderCard
              title="Projects"
              total={dashboard.projects.total}
              action={
                <Button
                  onClick={createProject}
                  variant="outline"
                  className="size-8 bg-neutral-300/80 hover:bg-neutral-300"
                  size={"icon"}
                >
                  <Plus />
                </Button>
              }
            />
            <Separator className="bg-gray-300" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
              {dashboard.projects.documents.map((project) => (
                <Button
                  className="col-span-1 flex items-center gap-2 p-4 bg-white rounded-md shadow-sm h-auto hover:bg-white text-black justify-start group"
                  key={project.$id}
                  asChild
                >
                  <Link
                    href={`/workspaces/${workspaceId}/projects/${project.$id}`}
                  >
                    <ProjectAvatar
                      name={project.name}
                      image={project.imageUrl}
                      className="size-10 text-base"
                    />
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-semibold capitalize truncate group-hover:underline underline-offset-2">
                        {project.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {project.taskCount.toLocaleString()} Tasks
                      </span>
                    </div>
                  </Link>
                </Button>
              ))}
            </div>
          </div>
          <div className="w-full rounded-lg border border-neutral-300 p-4 gap-4 flex flex-col">
            <HeaderCard
              title="Members"
              total={dashboard.members.total}
              action={
                <Button variant="outline" className="size-8" size={"icon"}>
                  <Link href={`/workspaces/${workspaceId}/members`}>
                    <Settings />
                  </Link>
                </Button>
              }
            />
            <Separator className="bg-gray-300" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
              {dashboard.members.documents.map((member) => (
                <div
                  className="col-span-1 flex items-center flex-col justify-center gap-2 p-4 rounded-md border border-gray-300"
                  key={member.$id}
                >
                  <MemberAvatar name={member.name} />
                  <div className="flex flex-col items-center justify-center gap-0.5">
                    <span className="text-sm font-semibold truncate capitalize">
                      {member.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {member.email}
                    </span>
                  </div>
                  <Badge
                    className={
                      "font-normal rounded-full bg-gray-200 hover:bg-gray-200 shadow-none text-black"
                    }
                  >
                    {member.role.toLowerCase()}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-4 w-full">
          <div className="border w-full rounded-lg border-gray-300 p-4 gap-4 flex flex-col">
            <HeaderCard
              title="Assigned Tasks"
              total={dashboard.tasks.total}
              action={
                <Button
                  onClick={createTask}
                  variant="outline"
                  className="size-8"
                  size={"icon"}
                >
                  <Plus />
                </Button>
              }
            />
            <Separator className="bg-gray-300" />
            <div className="flex flex-col gap-4 w-full">
              {dashboard.tasks.documents.map((task) => (
                <Button
                  className="border border-gray-300 p-4 flex flex-col rounded-md gap-1 shadow-none h-auto bg-transparent hover:bg-transparent text-black items-start group"
                  asChild
                  key={task.$id}
                >
                  <Link href={`/workspaces/${workspaceId}/tasks/${task.$id}`}>
                    <span className="text-sm font-semibold capitalize group-hover:underline truncate underline-offset-2">
                      {task.name}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs capitalize truncate">
                        {task.description}
                      </span>
                      <div className="size-1 rounded-full bg-neutral-400 flex-none" />
                      <div className="flex items-center gap-1 text-neutral-500 flex-none">
                        <CalendarIcon className="size-3" />
                        <span className="text-xs">
                          {formatDistanceStrict(
                            new Date(),
                            new Date(task.dueDate)
                          )}
                        </span>
                      </div>
                    </div>
                  </Link>
                </Button>
              ))}
            </div>
            <Button
              className="bg-neutral-300/80 text-black hover:bg-neutral-300 mt-auto"
              asChild
            >
              <Link href={`/workspaces/${workspaceId}/tasks`}>See More</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const HeaderCard = ({
  title,
  action,
  total,
}: {
  title: string;
  action: ReactNode;
  total: number;
}) => {
  return (
    <div className="flex w-full items-center justify-between">
      <h3 className="font-semibold truncate">
        {title} ({total.toLocaleString()})
      </h3>
      {action}
    </div>
  );
};
