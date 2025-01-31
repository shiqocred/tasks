import { protect } from "@/features/auth/server/queries";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import React from "react";
import { ProjectIdClient } from "./client";

export const metadata: Metadata = {
  title: "Project",
};

const ProjectIdPage = async () => {
  const user = await protect();
  if (!user) redirect("/sign-in");

  return (
    <div>
      <ProjectIdClient />
    </div>
  );
};

export default ProjectIdPage;
