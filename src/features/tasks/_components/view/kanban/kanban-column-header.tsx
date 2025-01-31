import { Button } from "@/components/ui/button";
import { useCreateTaskModal } from "@/features/tasks/hooks/use-create-task-modal";
import { TaksStatus } from "@/features/tasks/server/types";
import { snakeCaseToTitleCase } from "@/lib/utils";
import {
  CircleCheck,
  CircleDashedIcon,
  CircleDotDashedIcon,
  CircleDotIcon,
  CircleIcon,
  Plus,
} from "lucide-react";
import React, { ReactNode } from "react";

const statusIconMap: Record<TaksStatus, ReactNode> = {
  [TaksStatus.BACKLOG]: (
    <CircleDashedIcon className="size-[18px] text-pink-400" />
  ),
  [TaksStatus.TODO]: <CircleIcon className="size-[18px] text-red-400" />,
  [TaksStatus.IN_PROGRESS]: (
    <CircleDotDashedIcon className="size-[18px] text-yellow-500" />
  ),
  [TaksStatus.IN_REVIEW]: (
    <CircleDotIcon className="size-[18px] text-blue-400" />
  ),
  [TaksStatus.DONE]: <CircleCheck className="size-[18px] text-emerald-400" />,
};

export const KanbanColumnHeader = ({
  board,
  taskCount,
}: {
  board: TaksStatus;
  taskCount: number;
}) => {
  const { open, setInitialStatus } = useCreateTaskModal();
  const icon = statusIconMap[board];
  return (
    <div className="px-2 py-1.5 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-sm font-medium">{snakeCaseToTitleCase(board)}</h2>
        <p className="size-5 flex items-center justify-center rounded-md bg-neutral-200 text-xs text-neutral-700 font-medium">
          {taskCount}
        </p>
      </div>
      <Button
        onClick={() => {
          open();
          setInitialStatus(board);
        }}
        className="size-5"
        size={"icon"}
        variant={"ghost"}
      >
        <Plus className="text-gray-500" />
      </Button>
    </div>
  );
};
