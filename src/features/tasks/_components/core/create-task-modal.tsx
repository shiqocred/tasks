"use client";

import { ResponsiveModal } from "@/components/ui/responsive-modal";
import React from "react";
import { useCreateTaskModal } from "../../hooks/use-create-task-modal";
import { CreateTasksFormWrapper } from "./create-task-form-wrapper";

export const CreateTasksModal = () => {
  const { isOpen, close, initialProject, initialStatus, initialAssigne } =
    useCreateTaskModal();
  return (
    <ResponsiveModal open={isOpen} onOpenChange={close}>
      <CreateTasksFormWrapper
        initialProject={initialProject}
        initialStatus={initialStatus}
        initialAssigne={initialAssigne}
        onCancel={close}
      />
    </ResponsiveModal>
  );
};
