import { protect } from "@/features/auth/server/queries";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import { TaskIdClient } from "./client";

const TaskIdPage = async () => {
  const user = await protect();
  if (!user) redirect("/sign-in");

  return (
    <Suspense>
      <TaskIdClient />
    </Suspense>
  );
};

export default TaskIdPage;
