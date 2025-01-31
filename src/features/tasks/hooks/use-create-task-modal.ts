"use client";

import { parseAsBoolean, parseAsString, useQueryState } from "nuqs";

export const useCreateTaskModal = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "create-task",
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
  );
  const [initialStatus, setInitialStatus] = useQueryState(
    "initial-status",
    parseAsString
  );
  const [initialProject, setInitialProject] = useQueryState(
    "initial-project",
    parseAsString
  );
  const [initialAssigne, setInitialAssigne] = useQueryState(
    "initial-assigne",
    parseAsString
  );

  const open = () => setIsOpen(true);
  const close = () => {
    setIsOpen(false);
    setInitialStatus(null);
    setInitialProject(null);
    setInitialAssigne(null);
  };

  return {
    isOpen,
    initialStatus,
    initialProject,
    initialAssigne,
    open,
    close,
    setIsOpen,
    setInitialStatus,
    setInitialProject,
    setInitialAssigne,
  };
};
