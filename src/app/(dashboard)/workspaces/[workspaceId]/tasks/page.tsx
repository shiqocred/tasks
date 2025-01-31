import { protect } from "@/features/auth/server/queries";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import { TaskClient } from "./client";

const TasksPage = async () => {
  const user = await protect();
  if (!user) redirect("/sign-in");

  return (
    <Suspense>
      <TaskClient />
    </Suspense>
  );
};

export default TasksPage;
