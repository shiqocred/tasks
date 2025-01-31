import { protect } from "@/features/auth/server/queries";
import { EditWorkspaceForm } from "@/features/workspaces/_components/edit-workspace-form";
import { redirect } from "next/navigation";
import React from "react";

const WorkspaceIdSettingPage = async () => {
  const user = await protect();
  if (!user) redirect("/sign-in");

  return (
    <div className="w-full lg:max-w-xl">
      <EditWorkspaceForm />
    </div>
  );
};

export default WorkspaceIdSettingPage;
