"use client";

import { ChevronRight, Plus, type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import {
  GoCheckCircle,
  GoCheckCircleFill,
  GoHome,
  GoHomeFill,
} from "react-icons/go";
import { PiGearSix, PiGearSixFill, PiUsers, PiUsersFill } from "react-icons/pi";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

const data = [
  {
    title: "Home",
    url: "",
    icon: GoHome,
    iconActive: GoHomeFill,
  },
  {
    title: "My Tasks",
    url: "/tasks",
    icon: GoCheckCircle,
    iconActive: GoCheckCircleFill,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: PiGearSix,
    iconActive: PiGearSixFill,
  },
  {
    title: "Members",
    url: "/members",
    icon: PiUsers,
    iconActive: PiUsersFill,
  },
];

export function NavMain() {
  const pathname = usePathname();
  const workspaceId = useWorkspaceId();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {data.map((item) => {
          const basicHref = `/workspaces/${workspaceId}`;
          const fullHref = `${basicHref}${item.url}`;
          const isActive =
            (item.title === "Home" && pathname === basicHref) ||
            (item.title !== "Home" && pathname.startsWith(fullHref));
          const Icon = isActive ? item.iconActive : item.icon;
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                className={cn(
                  isActive
                    ? "bg-neutral-200/60 hover:bg-neutral-200"
                    : "hover:bg-neutral-200/60"
                )}
              >
                <Link href={fullHref}>
                  <Icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
