"use client";

import React from "react";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Card, CardContent } from "@/components/ui/card";
import { Loader } from "lucide-react";
import { EditTaskForm } from "./edit-task-form";
import { useMembers, useProjects, useTasks } from "@/features/api";

export const EditTasksFormWrapper = ({
  onCancel,
  id,
}: {
  onCancel: () => void;
  id: string;
}) => {
  const workspaceId = useWorkspaceId();

  const { data: initialValue, isLoading: isLoadingTask } = useTasks().show({
    taskId: id,
  });

  const { data: projects, isLoading: isLoadingProjects } = useProjects().list({
    workspaceId,
  });
  const { data: members, isLoading: isLoadingMembers } = useMembers().list({
    workspaceId,
  });

  const projectOptions = projects?.documents.map((project) => ({
    id: project.$id,
    name: project.name,
    imageUrl: project.imageUrl,
  }));
  const memberOptions = members?.documents.map((project) => ({
    id: project.$id,
    name: project.name,
  }));

  const isLoading = isLoadingProjects || isLoadingMembers || isLoadingTask;

  if (isLoading) {
    return (
      <Card className="w-full h-[714px] border-none shadow-none">
        <CardContent className="flex items-center justify-center h-full">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!initialValue) return null;

  return (
    <EditTaskForm
      onCancel={onCancel}
      initialValue={initialValue}
      projectOptions={projectOptions ?? []}
      memberOptions={memberOptions ?? []}
    />
  );
};
