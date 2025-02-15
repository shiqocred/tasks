"use client";

import { TaksStatus } from "@/lib/schemas";
import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";

export const useTaskFilter = () => {
  return useQueryStates({
    projectId: parseAsString,
    status: parseAsStringEnum(Object.values(TaksStatus)),
    assigneId: parseAsString,
    search: parseAsString,
    dueDate: parseAsString,
  });
};
