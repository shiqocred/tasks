"use client";

import React from "react";
import { ResponsiveModal } from "@/components/ui/responsive-modal";
import { useEditTaskModal } from "../../hooks/use-edit-task-modal";
import { EditTasksFormWrapper } from "./edit-task-form-wrapper";

export const EditTasksModal = () => {
  const { taskId, close } = useEditTaskModal();
  return (
    <ResponsiveModal open={!!taskId} onOpenChange={close}>
      {taskId && <EditTasksFormWrapper id={taskId} onCancel={close} />}
    </ResponsiveModal>
  );
};
