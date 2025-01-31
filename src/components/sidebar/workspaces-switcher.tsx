"use client";

import * as React from "react";
import { RiAddCircleFill } from "react-icons/ri";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  useSidebar,
} from "@/components/ui/sidebar";
import { useGetListWorkspaces } from "@/features/workspaces/api/use-get-list-workspace";
import { WorkspaceAvatar } from "../workspace-avatar";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { usePathname, useRouter } from "next/navigation";
import { useCreateWorkspaceModal } from "@/features/workspaces/hooks/use-create-workspace-modal";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Command, CommandGroup, CommandItem, CommandList } from "../ui/command";
import { Button } from "../ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function WorkspacesSwitcher() {
  const workspaceId = useWorkspaceId();
  const { isMobile, toggleSidebar, state } = useSidebar();
  const { data: workspaces, isLoading } = useGetListWorkspaces();
  const [openWorkspace, setOpenWorkspace] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { open } = useCreateWorkspaceModal();

  const onSelect = (id: string) => {
    router.push(`/workspaces/${id}`);
  };

  React.useEffect(() => {
    if (isMobile) {
      toggleSidebar();
    }
  }, [pathname]);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Workspaces</SidebarGroupLabel>
      <SidebarGroupAction onClick={open} title="add workspace">
        <RiAddCircleFill /> <span className="sr-only">Add Workspace</span>
      </SidebarGroupAction>
      <Popover open={openWorkspace} onOpenChange={setOpenWorkspace}>
        <PopoverTrigger asChild>
          <Button
            className={cn(
              "flex items-center gap-4 bg-neutral-200 w-full h-auto font-medium focus:ring-transparent disabled:opacity-100 text-black hover:bg-neutral-300 [&_svg]:size-3 relative overflow-hidden justify-between transition-all",
              state === "expanded" ? "p-1" : " p-0 [&_svg]:text-white shadow-md"
            )}
          >
            <div
              className={cn(
                "flex items-center justify-start gap-3 font-medium",
                isLoading ? "opacity-0" : "opacity-100"
              )}
            >
              <WorkspaceAvatar
                image={
                  workspaces?.documents.find((item) => item.$id === workspaceId)
                    ?.imageUrl
                }
                name={
                  workspaces?.documents.find((item) => item.$id === workspaceId)
                    ?.name
                }
              />
              {state === "expanded" && (
                <span className="truncate">
                  {
                    workspaces?.documents.find(
                      (item) => item.$id === workspaceId
                    )?.name
                  }
                </span>
              )}
            </div>
            <div
              className={cn(
                "flex items-center justify-center",
                state === "expanded"
                  ? "w-fit h-fit mx-1"
                  : "w-full h-full opacity-0 hover:opacity-100 hover:bg-black/30 absolute transition-all"
              )}
            >
              <ChevronsUpDown className="text-gray-500" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg p-0 shadow-sm"
          align="start"
          side={isMobile ? "bottom" : "right"}
          sideOffset={9}
        >
          <Command>
            <CommandList>
              <CommandGroup>
                {workspaces?.documents?.map((workspace) => (
                  <CommandItem
                    key={workspace.$id}
                    onSelect={() => {
                      setOpenWorkspace(false);
                      onSelect(workspace.$id);
                    }}
                    className="justify-between [&_svg]:size-3"
                  >
                    <div className="flex items-center justify-start gap-3 font-medium">
                      <WorkspaceAvatar
                        image={workspace.imageUrl}
                        name={workspace.name}
                      />
                      <span className="truncate">{workspace.name}</span>
                    </div>
                    {workspaceId === workspace.$id ? (
                      <Check className=" text-black" />
                    ) : null}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </SidebarGroup>
  );
}
