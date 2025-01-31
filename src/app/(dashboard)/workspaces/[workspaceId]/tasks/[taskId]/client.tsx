"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { ProjectAvatar } from "@/features/projects/_components/project-avatar";
import { useGetTask } from "@/features/tasks/api/use-get-task";
import { useTaskId } from "@/features/tasks/hooks/use-task-id";
import { ChevronRight, Loader, Trash2 } from "lucide-react";
import React from "react";
import { useDeleteTask } from "@/features/tasks/api/use-delete-task";
import { useConfirm } from "@/hooks/use-confirm";
import { useRouter } from "next/navigation";
import { TaskOverview } from "@/features/tasks/_components/overview/task-overview";
import { TaskDescription } from "@/features/tasks/_components/overview/task-description";

export const TaskIdClient = () => {
  const taskId = useTaskId();
  const router = useRouter();

  const { data, isLoading } = useGetTask({ taskId });
  const { mutate: deleteTask, isPending: isPendingDelete } = useDeleteTask();

  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete Task",
    "This action cannot be undone",
    "destructive"
  );

  const handleDeleteTask = async () => {
    const ok = await confirmDelete();

    if (!ok) return;

    deleteTask(
      { param: { taskId: data?.$id ?? "" } },
      {
        onSuccess: () => {
          router.push(`/workspaces/${data?.workspaceId}/tasks`);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="mx-3 flex flex-col gap-4">
        <DeleteDialog />
        <Navbar
          isLoading={isLoading}
          breadcrumb={[
            {
              loading: "Workspace",
            },
            {
              loading: "Project",
            },
            {
              loading: "Task",
            },
          ]}
        />
        <div className="h-[calc(100vh-128px)] flex items-center justify-center">
          <Loader className="size-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!data) {
    throw new Error("Not found");
  }

  return (
    <div className="mx-3 flex flex-col gap-4">
      <DeleteDialog />
      <Navbar
        isLoading={isLoading}
        breadcrumb={[
          {
            href: `/workspaces/${data?.workspaceId}`,
            label: data?.workspace.name,
          },
          {
            href: `/workspaces/${data?.workspaceId}/projects/${data?.projectId}`,
            label: data?.project.name,
          },
          {
            label: data?.name,
          },
        ]}
      />
      <div className="flex flex-col gap-4 w-full">
        <div className="flex items-center justify-between px-5 py-3 rounded-md border border-gray-300">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <ProjectAvatar
                image={data?.project.imageUrl}
                name={data?.project.name}
                className={"size-8 shadow"}
              />
              <p className="text-base font-semibold text-gray-500">
                {data?.project.name}
              </p>
            </div>
            <ChevronRight className="size-4 text-gray-500" />
            <p className="text-base font-semibold">{data?.name}</p>
          </div>
          <div>
            <Button
              size={"sm"}
              className="[&_svg]:size-3.5 bg-red-300 hover:bg-red-400 text-black"
              onClick={handleDeleteTask}
              disabled={isPendingDelete}
            >
              <Trash2 />
              Delete Task
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TaskOverview task={data} />
          <TaskDescription task={data} />
        </div>
      </div>
    </div>
  );
};
