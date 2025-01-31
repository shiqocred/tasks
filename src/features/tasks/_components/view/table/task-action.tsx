import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useConfirm } from "@/hooks/use-confirm";
import {
  ExternalLinkIcon,
  FolderSymlinkIcon,
  PencilIcon,
  TrashIcon,
} from "lucide-react";
import React, { ReactNode } from "react";
import { useDeleteTask } from "../../../api/use-delete-task";
import Link from "next/link";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useEditTaskModal } from "../../../hooks/use-edit-task-modal";

export const TaskAction = ({
  children,
  id,
  projectId,
}: {
  children: ReactNode;
  id: string;
  projectId: string;
}) => {
  const workspaceId = useWorkspaceId();

  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete Task",
    "this action cannot be undone.",
    "destructive"
  );

  const { open } = useEditTaskModal();

  const { mutate: deleteTask, isPending: isPendingDelete } = useDeleteTask();

  const handleDelete = async () => {
    const ok = await confirmDelete();
    if (!ok) return;
    deleteTask({ param: { taskId: id } });
  };
  return (
    <DropdownMenu modal={false}>
      <DeleteDialog />
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem asChild className="font-medium p-[10px] text-xs">
          <Link href={`/workspaces/${workspaceId}/tasks/${id}`}>
            <ExternalLinkIcon className="size-4 stroke-2" />
            Task Detail
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="font-medium p-[10px] text-xs" asChild>
          <Link href={`/workspaces/${workspaceId}/projects/${projectId}`}>
            <FolderSymlinkIcon className="size-4 stroke-2" />
            Open Project
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => open(id)}
          className="font-medium p-[10px] text-xs"
        >
          <PencilIcon className="size-4 stroke-2" />
          Edit Task
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleDelete}
          disabled={isPendingDelete}
          className="text-amber-700 focus:text-amber-700 font-medium p-[10px] text-xs"
        >
          <TrashIcon className="size-4 stroke-2" />
          Delete Task
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
