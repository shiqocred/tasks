import { protect } from "@/features/auth/server/queries";
import { MembersList } from "@/features/workspaces/_components/members-list";
import { redirect } from "next/navigation";
import React from "react";

const WorkspaceIdMembersPage = async () => {
  const user = await protect();

  if (!user) redirect("/sign-in");
  return (
    <div className="w-full lg:max-w-xl">
      <MembersList />
    </div>
  );
};

export default WorkspaceIdMembersPage;
