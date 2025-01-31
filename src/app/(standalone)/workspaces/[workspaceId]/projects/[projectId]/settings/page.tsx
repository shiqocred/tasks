import { protect } from "@/features/auth/server/queries";
import { EditProjectForm } from "@/features/projects/_components/edit-project-form";
import { redirect } from "next/navigation";
import React from "react";

const PeojectIdSettingsPage = async () => {
  const user = await protect();
  if (!user) return redirect("/sign-in");

  return (
    <div className="w-full lg:max-w-xl">
      <EditProjectForm />
    </div>
  );
};

export default PeojectIdSettingsPage;
