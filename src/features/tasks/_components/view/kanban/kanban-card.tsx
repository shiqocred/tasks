import React from "react";
import { TaskAction } from "../table/task-action";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MemberAvatar } from "@/components/member-avatar";
import { TaskDate } from "../table/task-date";
import { ProjectAvatar } from "@/features/projects/_components/project-avatar";
import { TaskType } from "@/lib/schemas";

export const KanbanCard = ({ task }: { task: TaskType }) => {
  return (
    <div className="p-2.5 mb-1.5 rounded bg-white hover:bg-white/50 shadow space-y-2.5 transition">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm line-clamp-2">{task.name}</p>
        <TaskAction id={task.$id} projectId={task.projectId}>
          <Button
            className="size-5 [&_svg]:size-4"
            size={"icon"}
            variant={"ghost"}
          >
            <MoreHorizontal className="stroke-1 shrink-0 text-gray-700 hover:opacity-75 transition cursor-pointer" />
          </Button>
        </TaskAction>
      </div>
      <Separator className="bg-gray-300" />
      <div className="flex items-center gap-1.5">
        <MemberAvatar
          name={task.assigne.name ?? "?"}
          fallbackClassName="text-[10px]"
          className="size-6"
        />
        <div className="size-1 rounded-full bg-neutral-300" />
        <TaskDate value={task.dueDate} className="text-xs" />
      </div>
      <div className="flex items-center gap-1.5">
        <ProjectAvatar
          name={task.project.name}
          image={task.project.imageUrl}
          fallbackClassName="text-[10px]"
          className="size-6"
        />
        <span className="text-xs font-medium">{task.project.name}</span>
      </div>
    </div>
  );
};
