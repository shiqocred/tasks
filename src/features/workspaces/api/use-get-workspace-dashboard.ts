import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

export const useGetWorkspaceDashboard = ({ workspaceId }: any) => {
  const query = useQuery({
    queryKey: ["workspace-dashboard", workspaceId],
    queryFn: async () => {
      const response = await client.api.workspaces[":workspaceId"][
        "dashboard"
      ].$get({
        param: { workspaceId },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch workspace dashboard");
      }

      const { data } = await response.json();

      return data;
    },
  });
  return query;
};
