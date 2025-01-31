import { protect } from "@/features/auth/server/queries";
import { redirect } from "next/navigation";
import React from "react";
import { TaskIdClient } from "./client";

const TaskIdPage = async () => {
  const user = await protect();
  if (!user) redirect("/sign-in");

  return (
    <div>
      <TaskIdClient />
    </div>
  );
};

export default TaskIdPage;
