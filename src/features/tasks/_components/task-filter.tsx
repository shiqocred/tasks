"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { FolderIcon, ListChecks, UserIcon } from "lucide-react";
import { useTaskFilter } from "../hooks/use-task-filter";
import { DatePicker } from "@/components/date-picker";
import { TaksStatus } from "@/lib/schemas";
import { useMembers, useProjects } from "@/features/api";

const TaskFilter = ({ hideProject }: { hideProject?: boolean }) => {
  const workspaceId = useWorkspaceId();
  const { data: projects, isLoading: isLoadingProject } = useProjects().list({
    workspaceId,
  });
  const { data: members, isLoading: isLoadingMember } = useMembers().list({
    workspaceId,
  });

  const isLoading = isLoadingProject || isLoadingMember;

  const projectOptions = projects?.documents.map((item) => ({
    value: item.$id,
    label: item.name,
  }));
  const memberOptions = members?.documents.map((item) => ({
    value: item.$id,
    label: item.name,
  }));

  const [{ assigneId, dueDate, projectId, status }, setFilter] =
    useTaskFilter();

  const onStatusChange = (value: string) => {
    setFilter({ status: value === "all" ? null : (value as TaksStatus) });
  };

  const onAssigneChange = (value: string) => {
    setFilter({ assigneId: value === "all" ? null : value });
  };
  const onProjectChange = (value: string) => {
    setFilter({ projectId: value === "all" ? null : value });
  };

  if (isLoading) return null;

  return (
    <div className="flex flex-col lg:flex-row gap-2">
      <Select
        defaultValue={status ?? undefined}
        onValueChange={(value) => onStatusChange(value)}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2 text-xs">
            <ListChecks className="size-4 mr-2" />
            <SelectValue placeholder={"All statuses"} />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectSeparator />
          <SelectItem value={TaksStatus.BACKLOG}>Backlog</SelectItem>
          <SelectItem value={TaksStatus.IN_PROGRESS}>In Progress</SelectItem>
          <SelectItem value={TaksStatus.IN_REVIEW}>In Review</SelectItem>
          <SelectItem value={TaksStatus.TODO}>Todo</SelectItem>
          <SelectItem value={TaksStatus.DONE}>Done</SelectItem>
        </SelectContent>
      </Select>
      {hideProject && (
        <Select
          defaultValue={assigneId ?? undefined}
          onValueChange={(value) => onAssigneChange(value)}
        >
          <SelectTrigger className="w-full lg:w-auto h-8">
            <div className="flex items-center pr-2 text-xs">
              <UserIcon className="size-4 mr-2" />
              <SelectValue placeholder={"All assignes"} />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All assignes</SelectItem>
            <SelectSeparator />
            {memberOptions?.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      {!hideProject && (
        <Select
          defaultValue={projectId ?? undefined}
          onValueChange={(value) => onProjectChange(value)}
        >
          <SelectTrigger className="w-full lg:w-auto h-8">
            <div className="flex items-center pr-2 text-xs">
              <FolderIcon className="size-4 mr-2" />
              <SelectValue placeholder={"All projects"} />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All projects</SelectItem>
            <SelectSeparator />
            {projectOptions?.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      <DatePicker
        placeholder="Due date"
        className="w-full lg:w-auto h-8"
        value={dueDate ? new Date(dueDate) : undefined}
        onChange={(date) => {
          setFilter({ dueDate: date ? date.toISOString() : null });
        }}
        filter={true}
      />
    </div>
  );
};

export default TaskFilter;
