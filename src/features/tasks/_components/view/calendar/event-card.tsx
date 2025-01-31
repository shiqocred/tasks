import { MemberAvatar } from "@/components/member-avatar";
import { ProjectAvatar } from "@/features/projects/_components/project-avatar";
import { ProjectType } from "@/features/projects/server/types";
import { TaksStatus } from "@/features/tasks/server/types";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import React, { MouseEvent } from "react";

const statusColorMap: Record<TaksStatus, string> = {
  [TaksStatus.BACKLOG]: "border-l-pink-500",
  [TaksStatus.TODO]: "border-l-red-500",
  [TaksStatus.IN_PROGRESS]: "border-l-yellow-500",
  [TaksStatus.IN_REVIEW]: "border-l-blue-500",
  [TaksStatus.DONE]: "border-l-emerald-500",
};

export const EventCard = ({
  id,
  title,
  status,
  project,
  assigne,
}: {
  id: string;
  title: string;
  status: TaksStatus;
  project: ProjectType;
  assigne: any;
}) => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();

  const onClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    router.push(`/workspaces/${workspaceId}/tasks/${id}`);
  };
  return (
    <div className="px-2">
      <div
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onClick(e as any);
          }
        }}
        className={cn(
          "p-1.5 text-xs bg-white text-primary border rounded-md border-l-4 flex flex-col gap-1.5 cursor-pointer hover:opacity-75 transition",
          statusColorMap[status]
        )}
      >
        <p>{title}</p>
        <div className="flex items-center gap-1">
          <MemberAvatar
            name={assigne?.name ?? "?"}
            className="size-6"
            fallbackClassName="text-xs"
          />
          <div className="size-1 rounded-full bg-neutral-300" />
          <ProjectAvatar name={project.name} image={project.imageUrl} />
        </div>
      </div>
    </div>
  );
};
