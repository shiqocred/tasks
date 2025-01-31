"use client";

import React from "react";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useGetListProjects } from "@/features/projects/api/use-get-list-projects";
import { useGetMembers } from "@/features/members/api/use-get-member";
import { Card, CardContent } from "@/components/ui/card";
import { Loader } from "lucide-react";
import { CreateTaskForm } from "./create-task-form";

export const CreateTasksFormWrapper = ({
  onCancel,
  initialStatus,
  initialProject,
  initialAssigne,
}: {
  onCancel: () => void;
  initialStatus: string | null;
  initialProject: string | null;
  initialAssigne: string | null;
}) => {
  const workspaceId = useWorkspaceId();

  const { data: projects, isLoading: isLoadingProjects } = useGetListProjects({
    workspaceId,
  });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
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

  const isLoading = isLoadingProjects || isLoadingMembers;

  if (isLoading) {
    return (
      <Card className="w-full h-[714px] border-none shadow-none">
        <CardContent className="flex items-center justify-center h-full">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <CreateTaskForm
      onCancel={onCancel}
      projectOptions={projectOptions ?? []}
      memberOptions={memberOptions ?? []}
      initialStatus={initialStatus ?? ""}
      initialProject={initialProject ?? ""}
      initialAssigne={initialAssigne ?? ""}
    />
  );
};
