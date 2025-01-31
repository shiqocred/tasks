import { protect } from "@/features/auth/server/queries";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import React from "react";
import { WorkspaceIdClient } from "./client";

export const metadata: Metadata = {
  title: "Workspace",
};

const WorkspaceIdPage = async () => {
  const user = await protect();
  if (!user) redirect("/sign-in");

  return <WorkspaceIdClient />;
};

export default WorkspaceIdPage;
