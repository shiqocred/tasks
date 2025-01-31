import { protect } from "@/features/auth/server/queries";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import { WorkspaceIdClient } from "./client";

export const metadata: Metadata = {
  title: "Workspace",
};

const WorkspaceIdPage = async () => {
  const user = await protect();
  if (!user) redirect("/sign-in");

  return (
    <Suspense>
      <WorkspaceIdClient />
    </Suspense>
  );
};

export default WorkspaceIdPage;
