import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";
import { TaksStatus } from "../server/types";

export const useTaskFilter = () => {
  return useQueryStates({
    projectId: parseAsString,
    status: parseAsStringEnum(Object.values(TaksStatus)),
    assigneId: parseAsString,
    search: parseAsString,
    dueDate: parseAsString,
  });
};
