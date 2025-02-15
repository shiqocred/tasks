import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { z } from "zod";
import { toast } from "sonner";
import {
  bulkTaskSchema,
  createTaskSchema,
  JoinSchema,
  LoginSchema,
  membersSchema,
  ProjectType,
  QueryTasks,
  SignUpSchema,
  TaksStatus,
  TaskType,
  WorkspaceType,
} from "@/lib/schemas";
import { useRouter } from "next/navigation";
import { Models } from "node-appwrite";

const useApi = (url: string) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const useGet = <TResponse>(
    queryKey: string[],
    message?: string,
    params?: Record<string, string>,
    searchParams?: Record<string, string | undefined | null>
  ) => {
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url = url.replace(`:${key}`, String(value));
      });
    }

    const queryString = searchParams
      ? "?" +
        new URLSearchParams(
          Object.fromEntries(
            Object.entries(searchParams).map(([key, value]) => [
              key,
              String(value),
            ])
          )
        )
      : "";

    const requestUrl = `${url}${queryString}`;

    return useQuery<TResponse>({
      queryKey: queryKey,
      queryFn: async (): Promise<TResponse> => {
        const response = await fetch(requestUrl, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error(
            message ? `failed to fetch ${message}` : "failed to fetch"
          );
        }

        const { data } = await response.json();

        return data;
      },
      enabled: !!params && Object.values(params).every((val) => !!val),
    });
  };

  const useRequest = (method: "POST" | "PATCH" | "DELETE" | "PUT") => {
    return (type?: "json" | "formData") => ({
      useMutate: <TResponse, TRequest = void>(
        message: string[],
        queryKey?: (data: TResponse) => (string | string[])[] | string[],
        refreshRouter?: boolean,
        params?: Record<string, string>
      ) => {
        // Replace dynamic params in URL
        if (params) {
          Object.entries(params).forEach(([key, value]) => {
            url = url.replace(`:${key}`, String(value));
          });
        }

        return useMutation<TResponse, Error, TRequest>({
          mutationFn: async (body: TRequest) => {
            let bodyData: BodyInit | undefined;
            const headers: HeadersInit = {};

            // Hanya metode yang membutuhkan request body yang memiliki tipe (json/formData)
            if (type) {
              if (type === "json") {
                headers["Content-Type"] = "application/json";
                bodyData = body ? JSON.stringify(body) : undefined;
              } else if (type === "formData" && body instanceof FormData) {
                bodyData = body;
              } else {
                throw new Error("Invalid body type for formData request");
              }
            }

            const response = await fetch(url, {
              method,
              headers,
              body: bodyData,
            });

            if (!response.ok) throw new Error(`Failed to ${message[1]}`);

            return await response.json();
          },
          onSuccess: (data) => {
            if (refreshRouter) {
              router.refresh();
            }
            toast.success(message[0]);

            if (queryKey) {
              const keys =
                typeof queryKey === "function" ? queryKey(data) : queryKey;
              keys.forEach((key) => {
                queryClient.invalidateQueries({
                  queryKey: Array.isArray(key) ? key : [key],
                });
              });
            }
          },
          onError: (err) => toast.error(err.message),
        });
      },
    });
  };

  return {
    get: useGet,
    post: useRequest("POST"),
    patch: useRequest("PATCH"),
    put: useRequest("PUT"),
    delete: useRequest("DELETE"),
  };
};

// auth API

const baseAuthUrl = "/api/auth";

export const useAuth = () => {
  const useLogin = useApi(`${baseAuthUrl}/login`)
    .post("json")
    .useMutate<{ data: { success: boolean } }, z.infer<typeof LoginSchema>>(
      ["Logged in", "Login"],
      () => ["current"],
      true
    );
  const useRegister = useApi(`${baseAuthUrl}/register`)
    .post("json")
    .useMutate<{ data: { success: boolean } }, z.infer<typeof SignUpSchema>>(
      ["Registered successfully", "Register"],
      () => ["current"],
      true
    );
  const useCurrent = useApi(`${baseAuthUrl}/current`).get<{
    name: string;
    email: string;
  }>(["current"]);
  const useLogout = useApi(`${baseAuthUrl}/logout`)
    .post("json")
    .useMutate<{ data: { suceess: boolean } }>(["Logged out", "logout"], () => [
      "current",
      "workspaces",
    ]);

  return {
    login: useLogin,
    register: useRegister,
    current: useCurrent,
    logout: useLogout,
  };
};

// workspaces API

const baseWorkspaceUrl = "/api/workspaces";

export const useWorkspaces = () => {
  // query ------------------------------------------------------------------------------------------------
  const useList = useApi(`${baseWorkspaceUrl}`).get<
    Models.DocumentList<WorkspaceType>
  >(["workspaces"], "workspaces");
  const useShow = ({ workspaceId }: { workspaceId: string }) =>
    useApi(`${baseWorkspaceUrl}/:workspaceId`).get<WorkspaceType>(
      ["workspace", workspaceId],
      "workspace",
      { workspaceId }
    );
  const useAnalytics = ({ workspaceId }: { workspaceId: string }) =>
    useApi(`${baseWorkspaceUrl}/:workspaceId/analytics`).get<{
      projectCount: number;
      projectDifference: number;
      taskCount: number;
      taskDifference: number;
      taskAssignedCount: number;
      taskAssignedDifference: number;
      taskIncompleteCount: number;
      taskIncompleteDifference: number;
      taskCompletedCount: number;
      taskCompletedDifference: number;
      taskOverdueCount: number;
      taskOverdueDifference: number;
    }>(["workspace-analytics"], "workspace analytics", { workspaceId });
  const useDashboard = ({ workspaceId }: { workspaceId: string }) =>
    useApi(`${baseWorkspaceUrl}/:workspaceId/dashboard`).get<{
      tasks: Models.DocumentList<TaskType>;
      members: Models.DocumentList<
        Models.Document & {
          name: string;
          email: string;
          role: any;
          owner: boolean;
        }
      >;
      projects: Models.DocumentList<
        Models.Document & {
          taskCount: number;
          name: string;
          imageUrl: string;
          workspaceId: string;
        }
      >;
    }>(["workspace-dashboard"], "dashboard", { workspaceId });
  // mutate ------------------------------------------------------------------------------------------------
  const useCreate = useApi(`${baseWorkspaceUrl}`)
    .post("formData")
    .useMutate<{ data: WorkspaceType }, FormData>(
      ["workspace successfully created", "create workspace"],
      () => [
        "workspaces",
        "workspace-dashboard",
        "workspace-analytics",
        "project-analytics",
      ]
    );
  const useDelete = ({ workspaceId }: { workspaceId: string }) =>
    useApi(`${baseWorkspaceUrl}/:workspaceId`)
      .delete()
      .useMutate<{
        data: { $id: string };
      }>(
        ["workspace successfully deleted", "delete workspace"],
        ({ data }) => [
          "workspaces",
          "workspace-dashboard",
          "workspace-analytics",
          "project-analytics",
          ["workspace", data.$id],
        ],
        false,
        { workspaceId }
      );
  const usePatch = ({ workspaceId }: { workspaceId: string }) =>
    useApi(`${baseWorkspaceUrl}/:workspaceId`)
      .patch("formData")
      .useMutate<{ data: WorkspaceType }, FormData>(
        ["Workspace successfully updated", "update workspace"],
        ({ data }) => [
          "workspaces",
          "workspace-dashboard",
          "workspace-analytics",
          "project-analytics",
          ["workspace", data.$id],
        ],
        false,
        { workspaceId }
      );
  const useResetInviteCode = ({ workspaceId }: { workspaceId: string }) =>
    useApi(`${baseWorkspaceUrl}/:workspaceId/reset-invite-code`)
      .post()
      .useMutate<{ data: Models.Document }>(
        ["Invite code successfully reseted.", "reset invite code"],
        ({ data }) => ["workspaces", ["workspace", data.$id]],
        false,
        { workspaceId }
      );

  return {
    list: useList,
    show: useShow,
    analytics: useAnalytics,
    dashboard: useDashboard,
    create: useCreate,
    patch: usePatch,
    delete: useDelete,
    resetInviteCode: useResetInviteCode,
  };
};

// JOIN API

const baseJoinUrl = "/api/join";

export const useJoin = () => {
  // query -----------------------------------------------------------------------
  const useInfo = ({ inviteCode }: { inviteCode: string }) =>
    useApi(`${baseJoinUrl}/:inviteCode/info`).get<{
      status: boolean;
      data: {
        id: string;
        name: string;
        imageUrl: string;
        members: number;
      } | null;
    }>(["invite-code", inviteCode], "workspace info", { inviteCode });
  // mutation --------------------------------------------------------------------
  const useAccept = ({ inviteCode }: { inviteCode: string }) =>
    useApi(`${baseJoinUrl}/:inviteCode`)
      .post("json")
      .useMutate<{ data: WorkspaceType }, z.infer<typeof JoinSchema>>(
        ["Successfully joined workspace", "join workspace"],
        ({ data }) => ["workspaces", ["workspace", data.$id]],
        false,
        { inviteCode }
      );

  return {
    info: useInfo,
    accept: useAccept,
  };
};

// PROJECTS API

const baseProjectUrl = "/api/projects";

export const useProjects = () => {
  // query ------------------------------------------------------------------------------------------------
  const useList = ({ workspaceId }: { workspaceId: string }) =>
    useApi(`${baseProjectUrl}`).get<Models.DocumentList<ProjectType>>(
      ["projects"],
      "projects",
      undefined,
      { workspaceId }
    );
  const useShow = ({ projectId }: { projectId: string }) =>
    useApi(`${baseProjectUrl}/:projectId`).get<
      ProjectType & {
        workspace: {
          $id: string;
          name: any;
        };
      }
    >(["project", projectId], "project", { projectId });
  const useAnalytics = ({ projectId }: { projectId: string }) =>
    useApi(`${baseProjectUrl}/:projectId/analytics`).get<{
      taskCount: number;
      taskDifference: number;
      taskAssignedCount: number;
      taskAssignedDifference: number;
      taskIncompleteCount: number;
      taskIncompleteDifference: number;
      taskCompletedCount: number;
      taskCompletedDifference: number;
      taskOverdueCount: number;
      taskOverdueDifference: number;
    }>(["project-analytics"], "project analytics", { projectId });
  // mutate ------------------------------------------------------------------------------------------------
  const useCreate = useApi(`${baseProjectUrl}`)
    .post("formData")
    .useMutate<{ data: ProjectType }, FormData>(
      ["project successfully created", "create project"],
      () => [
        "projects",
        "workspace-dashboard",
        "workspace-analytics",
        "project-analytics",
      ]
    );
  const useDelete = ({ projectId }: { projectId: string }) =>
    useApi(`${baseProjectUrl}/:projectId`)
      .delete()
      .useMutate<{
        data: { $id: string };
      }>(
        ["project successfully deleted", "delete project"],
        ({ data }) => [
          "projects",
          "workspace-dashboard",
          "workspace-analytics",
          "project-analytics",
          ["project", data.$id],
        ],
        false,
        { projectId }
      );
  const usePatch = ({ projectId }: { projectId: string }) =>
    useApi(`${baseProjectUrl}/:projectId`)
      .patch("formData")
      .useMutate<{ data: ProjectType }, FormData>(
        ["project successfully updated", "update project"],
        ({ data }) => [
          "projects",
          "workspace-dashboard",
          "workspace-analytics",
          "project-analytics",
          ["project", data.$id],
        ],
        false,
        { projectId }
      );

  return {
    list: useList,
    show: useShow,
    analytics: useAnalytics,
    create: useCreate,
    patch: usePatch,
    delete: useDelete,
  };
};

// MEMBER API

const baseMemberUrl = "/api/members";

export const useMembers = () => {
  // query ------------------------------------------------------------------------------------------------
  const useList = ({ workspaceId }: { workspaceId: string }) =>
    useApi(`${baseMemberUrl}`).get<
      Models.DocumentList<
        Models.Document & {
          name: string;
          email: string;
          role: any;
          owner: boolean;
        }
      >
    >(["members"], "members", undefined, { workspaceId });
  // mutate ------------------------------------------------------------------------------------------------
  const useDelete = useApi(`${baseMemberUrl}`)
    .delete()
    .useMutate<{ data: { $id: string } }, { memberId: string }>(
      ["Memebr successfully deleted", "delete memebr"],
      () => ["members", "workspace-dashboard"]
    );
  const usePatch = useApi(`${baseMemberUrl}`)
    .patch()
    .useMutate<{ data: { $id: string } }, z.infer<typeof membersSchema>>(
      ["Member successfully updated", "update member"],
      () => ["members", "workspace-dashboard"]
    );
  return {
    list: useList,
    patch: usePatch,
    delete: useDelete,
  };
};

// TASKS API

const baseTaskUrl = "/api/tasks";
/* eslint-disable @typescript-eslint/no-unused-vars */
const createTaskSchemaPartial = createTaskSchema.partial();
/* eslint-enable @typescript-eslint/no-unused-vars */

export const useTasks = () => {
  // query ------------------------------------------------------------------------------------------------
  const useList = ({
    workspaceId,
    projectId,
    assigneId,
    status,
    search,
    dueDate,
  }: z.infer<typeof QueryTasks>) =>
    useApi(`${baseTaskUrl}`).get<
      Models.DocumentList<
        TaskType & {
          project: ProjectType | undefined;
          assigne:
            | (Models.Document & { name: string; email: string })
            | undefined;
        }
      >
    >(
      [
        "tasks",
        workspaceId,
        projectId!,
        assigneId!,
        status!,
        dueDate!,
        search!,
      ],
      "tasks",
      undefined,
      { workspaceId, projectId, assigneId, status, search, dueDate }
    );
  const useShow = ({ taskId }: { taskId: string }) =>
    useApi(`${baseTaskUrl}/:taskId`).get<
      TaskType & {
        workspace: WorkspaceType;
        assigne: Models.Document & { name: string; email: string };
        project: ProjectType;
      }
    >(["task", taskId], "task", { taskId });
  // mutate ------------------------------------------------------------------------------------------------
  const useBulkUpdate = useApi(`${baseTaskUrl}/bulk-update`)
    .post("json")
    .useMutate<
      {
        data: (Models.Document & {
          name: string;
          status: TaksStatus;
          assigneId: string;
          projectId: string;
          workspaceId: string;
          position: number;
          dueDate: string;
          description?: string;
        })[];
      },
      z.infer<typeof bulkTaskSchema>
    >(["Tasks successfully updated", "update tasks"], () => [
      "tasks",
      "workspace-dashboard",
      "workspace-analytics",
      "project-analytics",
    ]);
  const useCreate = useApi(`${baseTaskUrl}`)
    .post("json")
    .useMutate<{ data: TaskType }, z.infer<typeof createTaskSchema>>(
      ["Task successfully created", "create task"],
      () => [
        "tasks",
        "workspace-dashboard",
        "workspace-analytics",
        "project-analytics",
      ]
    );
  const useDelete = ({ taskId }: { taskId: string }) =>
    useApi(`${baseTaskUrl}/:taskId`)
      .delete()
      .useMutate<{
        data: { $id: string };
      }>(
        ["Task successfully deleted", "delete task"],
        ({ data }) => [
          "tasks",
          "workspace-dashboard",
          "workspace-analytics",
          "project-analytics",
          ["task", data.$id],
        ],
        false,
        { taskId }
      );
  const usePatch = ({ taskId }: { taskId: string }) =>
    useApi(`${baseTaskUrl}/:taskId`)
      .patch("json")
      .useMutate<
        { data: ProjectType },
        z.infer<typeof createTaskSchemaPartial>
      >(
        ["Task successfully updated", "update task"],
        ({ data }) => [
          "tasks",
          "workspace-dashboard",
          "workspace-analytics",
          "project-analytics",
          ["task", data.$id],
        ],
        false,
        { taskId }
      );

  return {
    list: useList,
    show: useShow,
    create: useCreate,
    patch: usePatch,
    delete: useDelete,
    bulkUpdate: useBulkUpdate,
  };
};
