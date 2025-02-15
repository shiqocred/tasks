import React from "react";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { OverviewProperty } from "./overview-property";
import { MemberAvatar } from "@/components/member-avatar";
import { TaskDate } from "../view/table/task-date";
import { Badge } from "@/components/ui/badge";
import { snakeCaseToTitleCase } from "@/lib/utils";
import { useEditTaskModal } from "../../hooks/use-edit-task-modal";
import { TaskType } from "@/lib/schemas";

export const TaskOverview = ({ task }: { task: TaskType }) => {
  const { open } = useEditTaskModal();

  return (
    <div className="flex flex-col gap-4 col-span-1">
      <div className="bg-muted rounded-lg p-4 ">
        <div className="flex items-center justify-between">
          <p className="text-base font-semibold">Overview</p>
          <Button
            className="bg-yellow-400 hover:bg-yellow-500 text-black"
            size="sm"
            onClick={() => {
              open(task.$id);
            }}
          >
            <PencilIcon />
            Edit
          </Button>
        </div>
        <Separator className="my-4 bg-gray-400" />
        <div className="flex flex-col gap-4">
          <OverviewProperty label="Assigne">
            <MemberAvatar name={task.assigne.name} className="size-6 text-xs" />
            <p className="text-sm font-medium">{task.assigne.name}</p>
          </OverviewProperty>
          <OverviewProperty label="Due Date">
            <TaskDate value={task.dueDate} className="text-sm font-medium" />
          </OverviewProperty>
          <OverviewProperty label="Status">
            <Badge variant={task.status}>
              {snakeCaseToTitleCase(task.status)}
            </Badge>
          </OverviewProperty>
        </div>
      </div>
    </div>
  );
};
