import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<(typeof client.api.join)["$post"], 200>;
type RequestType = InferRequestType<(typeof client.api.join)["$post"]>;

export const useJoinWorkspace = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.join["$post"]({
        json,
      });
      if (!response.ok) {
        throw new Error("Failed to join workspace");
      }
      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Joined workspace.");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", data.$id] });
    },
    onError: () => {
      toast.error("Failed to join workspace.");
    },
  });

  return mutation;
};
