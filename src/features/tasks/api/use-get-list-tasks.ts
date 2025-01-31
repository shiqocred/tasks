import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { TaksStatus } from "../server/types";

export const useGetListTasks = ({
  workspaceId,
  projectId,
  assigneId,
  status,
  dueDate,
  search,
}: {
  workspaceId: string;
  projectId?: string | null;
  assigneId?: string | null;
  status?: TaksStatus | null;
  dueDate?: string | null;
  search?: string | null;
}) => {
  const query = useQuery({
    queryKey: [
      "tasks",
      workspaceId,
      projectId,
      assigneId,
      status,
      dueDate,
      search,
    ],
    queryFn: async () => {
      const response = await client.api.tasks.$get({
        query: {
          workspaceId,
          projectId: projectId ?? undefined,
          assigneId: assigneId ?? undefined,
          status: status ?? undefined,
          dueDate: dueDate ?? undefined,
          search: search ?? undefined,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const { data } = await response.json();

      return data;
    },
  });
  return query;
};
