import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

export const useGetWorkspaceInfo = ({ inviteCode }: { inviteCode: string }) => {
  const query = useQuery({
    queryKey: ["invite-code", inviteCode],
    queryFn: async () => {
      const response = await client.api.workspaces[":inviteCode"]["info"].$get({
        param: { inviteCode },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch workspace info");
      }

      const { data } = await response.json();

      return data;
    },
  });
  return query;
};
