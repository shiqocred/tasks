import React from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { CreateWorkspaceModal } from "@/features/workspaces/_components/create-workspace-modal";
import { CreateProjectModal } from "@/features/projects/_components/create-project-modal";
import { CreateTasksModal } from "@/features/tasks/_components/core/create-task-modal";
import { EditTasksModal } from "@/features/tasks/_components/core/edit-task-modal";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <CreateWorkspaceModal />
      <CreateProjectModal />
      <CreateTasksModal />
      <EditTasksModal />
      <AppSidebar />
      <SidebarInset className="bg-white overflow-hidden pb-32">
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;
