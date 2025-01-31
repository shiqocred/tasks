import React from "react";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";
import { RiAddCircleFill } from "react-icons/ri";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useGetListProjects } from "@/features/projects/api/use-get-list-projects";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";
import { ProjectAvatar } from "@/features/projects/_components/project-avatar";
import { AlertTriangle, Database, Loader } from "lucide-react";

export const Projects = () => {
  const workspaceId = useWorkspaceId();
  const { data, error, isLoading } = useGetListProjects({
    workspaceId,
  });
  const pathname = usePathname();
  const { open } = useCreateProjectModal();
  const { state } = useSidebar();

  if (isLoading) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Projects</SidebarGroupLabel>
        <div className="w-full h-60">
          <div className="w-full h-full flex flex-col items-center justify-center border border-dashed bg-neutral-100 rounded-md">
            <Loader className="size-5 animate-spin" />
          </div>
        </div>
      </SidebarGroup>
    );
  }

  if (!data) {
    console.error(error);
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Projects</SidebarGroupLabel>
        <div className="w-full h-60">
          <div className="w-full h-full flex flex-col items-center justify-center border border-dashed bg-neutral-100 rounded-md gap-1">
            <AlertTriangle className="size-5" />
            <p className="text-xs font-semibold">{error?.message}</p>
          </div>
        </div>
      </SidebarGroup>
    );
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarGroupAction
        disabled={isLoading}
        onClick={open}
        title="add project"
      >
        <RiAddCircleFill /> <span className="sr-only">Add Project</span>
      </SidebarGroupAction>
      <SidebarMenu>
        {data.total > 0 ? (
          data.documents.map((item) => {
            const fullHref = `/workspaces/${workspaceId}/projects/${item.$id}`;
            const isActive = pathname.startsWith(fullHref);
            return (
              <SidebarMenuItem key={item.$id}>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "h-auto",
                    state === "collapsed"
                      ? "!p-0 size-[31px] justify-center border"
                      : "",
                    isActive
                      ? "bg-neutral-200/60 hover:bg-neutral-200"
                      : "hover:bg-neutral-200/60"
                  )}
                >
                  <Link href={fullHref}>
                    <ProjectAvatar image={item.imageUrl} name={item.name} />
                    {state === "expanded" && item.name}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })
        ) : (
          <div className="h-[200px] px-2">
            <div className="h-full flex flex-col items-center justify-center gap-2 border border-dashed border-gray-300 rounded-md">
              <Database className="size-5" />
              <p className="text-xs font-semibold">No project yet.</p>
            </div>
          </div>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
};
