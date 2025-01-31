"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CalendarDaysIcon,
  KanbanSquareDashed,
  Loader,
  PlusIcon,
  Table2Icon,
} from "lucide-react";
import React, { useCallback } from "react";
import { useCreateTaskModal } from "../hooks/use-create-task-modal";
import { useGetListTasks } from "../api/use-get-list-tasks";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useQueryState } from "nuqs";
import TaskFilter from "./task-filter";
import { useTaskFilter } from "../hooks/use-task-filter";
import { DataTable } from "./view/table/data-table";
import { columns } from "./view/table/columns";
import { DataKanban } from "./view/kanban/data-kanban";
import { TaksStatus } from "../server/types";
import { useBulkUpdateTasks } from "../api/use-bulk-update-tasks";
import { DataCalendar } from "./view/calendar/data-calendar";
import { useProjectId } from "@/features/projects/hooks/use-project-id";

const TaksViewSwitcher = ({
  hideProject,
  isTasks = false,
}: {
  hideProject?: boolean;
  isTasks?: boolean;
}) => {
  const workspaceId = useWorkspaceId();
  const paramProjectId = useProjectId();

  const [{ assigneId, dueDate, projectId, search, status }] = useTaskFilter();
  const [view, setView] = useQueryState("view-task", {
    defaultValue: "table",
  });

  const { mutate: bulkUpdate } = useBulkUpdateTasks();

  const { open, setInitialProject, setInitialAssigne } = useCreateTaskModal();
  const { data: tasks, isLoading: isLoadingTask } = useGetListTasks({
    workspaceId,
    assigneId: isTasks ? "user-assigne" : assigneId,
    dueDate,
    projectId: hideProject ? paramProjectId : projectId,
    search,
    status,
  });

  const onKanbanChange = useCallback(
    (tasks: { $id: string; status: TaksStatus; position: number }[]) => {
      bulkUpdate({
        json: { tasks },
      });
    },
    [bulkUpdate]
  );

  return (
    <Tabs
      defaultValue={view}
      onValueChange={setView}
      className="flex-1 w-full rounded-lg border border-gray-300"
    >
      <div className="h-full flex flex-col overflow-auto p-4">
        <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger value="table" className="h-8 w-full text-xs lg:w-auto">
              <Table2Icon className="mr-2 size-4" />
              Table
            </TabsTrigger>
            <TabsTrigger
              value="kanban"
              className="h-8 w-full text-xs lg:w-auto"
            >
              <KanbanSquareDashed className="mr-2 size-4" />
              Kanban
            </TabsTrigger>
            <TabsTrigger
              value="calendar"
              className="h-8 w-full text-xs lg:w-auto"
            >
              <CalendarDaysIcon className="mr-2 size-4" />
              Calendar
            </TabsTrigger>
          </TabsList>
          <Button
            className="w-full lg:w-auto bg-blue-400/80 hover:bg-blue-400 text-black"
            size={"sm"}
            onClick={() => {
              open();
              if (hideProject) {
                setInitialProject(paramProjectId);
              } else if (isTasks) {
                setInitialAssigne(tasks?.documents[0].assigneId ?? "");
              }
            }}
          >
            <PlusIcon className="mr-2" />
            New Task
          </Button>
        </div>
        <Separator className="my-4 bg-gray-300" />
        <TaskFilter hideProject={hideProject} />
        <Separator className="my-4 bg-gray-300" />
        {isLoadingTask ? (
          <div className="w-full h-[200px] border flex items-center justify-center rounded-lg">
            <Loader className="animate-spin size-5 text-muted-foreground" />
          </div>
        ) : (
          <>
            <TabsContent value="table" className="mt-0">
              <DataTable columns={columns} data={tasks?.documents ?? []} />
            </TabsContent>
            <TabsContent value="kanban" className="mt-0">
              <DataKanban
                onchange={onKanbanChange}
                data={tasks?.documents ?? []}
              />
            </TabsContent>
            <TabsContent value="calendar" className="mt-0">
              <DataCalendar data={tasks?.documents ?? []} />
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
};

export default TaksViewSwitcher;
