import { protect } from "@/features/auth/server/queries";
import { JoinWorkspaceForm } from "@/features/workspaces/_components/join-workspace-form";
import { redirect } from "next/navigation";
import React from "react";

const InviteMemberPage = async () => {
  const user = await protect();
  if (!user) redirect("/sign-in");

  return (
    <div className="w-full">
      <JoinWorkspaceForm />
    </div>
  );
};

export default InviteMemberPage;
