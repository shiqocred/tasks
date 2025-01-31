"use client";

import { ResponsiveModal } from "@/components/ui/responsive-modal";
import React from "react";
import { useCreateWorkspaceModal } from "../hooks/use-create-workspace-modal";
import { CreateWorkspaceForm } from "./create-workspace-form";

export const CreateWorkspaceModal = () => {
  const { isOpen, setIsOpen, close } = useCreateWorkspaceModal();
  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateWorkspaceForm onCancel={close} />
    </ResponsiveModal>
  );
};
