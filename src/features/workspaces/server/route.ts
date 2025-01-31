import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createWorkspaceSchema, updateWorkspaceSchema } from "./schemas";
import { sessionMiddleware } from "@/lib/session-middleware";
import {
  DATABASE_ID,
  WORKSPACES_ID,
  IMAGE_BUCKET_ID,
  MEMBERS_ID,
  TASKS_ID,
  PROJECTS_ID,
} from "@/config";
import { ID, Query } from "node-appwrite";
import { MemberRole } from "../../members/types";
import { generateInviteCode } from "@/lib/utils";
import { getMember } from "../../members/utils";
import { WorkspaceType } from "./types";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { TaksStatus, TaskType } from "@/features/tasks/server/types";
import { ProjectType } from "@/features/projects/server/types";
import { createAdminClient } from "@/lib/appwrite";

const app = new Hono()
  .get("/", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");

    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal("userId", user.$id),
    ]);

    if (members.total === 0) {
      return c.json({ data: { documents: [], total: 0 } });
    }

    const workspaceIds = members.documents.map((member) => member.workspaceId);

    const workspaces = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACES_ID,
      [Query.orderDesc("$createdAt"), Query.contains("$id", workspaceIds)]
    );

    return c.json({ data: workspaces });
  })
  .post(
    "/",
    zValidator("form", createWorkspaceSchema),
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");

      const { name, image } = c.req.valid("form");

      const generateNewCode = generateInviteCode(6);

      const oldWorkspace = await databases.listDocuments(
        DATABASE_ID,
        WORKSPACES_ID
      );

      const someCode = oldWorkspace.documents.some(
        (item) => item.inviteCode === generateNewCode
      );

      if (someCode) {
        return c.json({ error: "Something went wrong, please try again" }, 400);
      }

      let uploadImageUrl: string | undefined;

      if (image instanceof File) {
        const file = await storage.createFile(
          IMAGE_BUCKET_ID,
          ID.unique(),
          image
        );

        const arrayBuffer = await storage.getFilePreview(
          IMAGE_BUCKET_ID,
          file.$id
        );

        uploadImageUrl = `data:image/png;base64,${Buffer.from(
          arrayBuffer
        ).toString("base64")}`;
      }

      const workspace = await databases.createDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        ID.unique(),
        {
          name,
          userId: user.$id,
          imageUrl: uploadImageUrl,
          inviteCode: generateNewCode,
        }
      );

      await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
        userId: user.$id,
        workspaceId: workspace.$id,
        role: MemberRole.ADMIN,
      });

      return c.json({ data: workspace });
    }
  )
  .patch(
    "/:workspaceId",
    zValidator("form", updateWorkspaceSchema),
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");

      const { workspaceId } = c.req.param();
      const { name, image } = c.req.valid("form");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member || member.role !== MemberRole.ADMIN) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      let uploadImageUrl: string | undefined;

      if (image instanceof File) {
        const file = await storage.createFile(
          IMAGE_BUCKET_ID,
          ID.unique(),
          image
        );

        const arrayBuffer = await storage.getFilePreview(
          IMAGE_BUCKET_ID,
          file.$id
        );

        uploadImageUrl = `data:image/png;base64,${Buffer.from(
          arrayBuffer
        ).toString("base64")}`;
      } else {
        uploadImageUrl = image;
      }

      const workspace = await databases.updateDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceId,
        {
          name,
          imageUrl: uploadImageUrl,
        }
      );
      return c.json({ data: workspace });
    }
  )
  .delete("/:workspaceId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    const { workspaceId } = c.req.param();

    const existingWorkspace = await databases.getDocument(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId
    );

    if (!existingWorkspace) {
      return c.json({ error: "Workspace not found" }, 404);
    }

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member || member.role !== MemberRole.ADMIN) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const [existingTasks, existingProjects] = await Promise.all([
      databases.listDocuments(DATABASE_ID, TASKS_ID, [
        Query.equal("workspaceId", existingWorkspace.$id),
      ]),
      databases.listDocuments(DATABASE_ID, PROJECTS_ID, [
        Query.equal("workspaceId", existingWorkspace.$id),
      ]),
    ]);

    await Promise.all([
      ...existingTasks.documents.map((item) =>
        databases.deleteDocument(DATABASE_ID, TASKS_ID, item.$id)
      ),
      ...existingProjects.documents.map((item) =>
        databases.deleteDocument(DATABASE_ID, PROJECTS_ID, item.$id)
      ),
    ]);

    await databases.deleteDocument(DATABASE_ID, WORKSPACES_ID, workspaceId);

    return c.json({ data: { $id: workspaceId } });
  })
  .post("/:workspaceId/reset-invite-code", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    const { workspaceId } = c.req.param();

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member || member.role !== MemberRole.ADMIN) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const generateNewCode = generateInviteCode(6);

    const oldWorkspace = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACES_ID
    );

    const someCode = oldWorkspace.documents.some(
      (item) => item.inviteCode === generateNewCode
    );

    if (someCode) {
      return c.json({ error: "Something went wrong, please try again" }, 400);
    }

    const workspace = await databases.updateDocument(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId,
      {
        inviteCode: generateNewCode,
      }
    );
    return c.json({ data: workspace });
  })
  .get("/:workspaceId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    const { workspaceId } = c.req.param();

    const workspace = await databases.getDocument(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId
    );

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    return c.json({ data: workspace });
  })
  .get("/:inviteCode/info", sessionMiddleware, async (c) => {
    const databases = c.get("databases");

    const { inviteCode } = c.req.param();

    const workspace = await databases.listDocuments<WorkspaceType>(
      DATABASE_ID,
      WORKSPACES_ID,
      [Query.equal("inviteCode", inviteCode)]
    );

    if (!workspace) {
      return c.json({ error: "Invalid code" }, 404);
    }

    const isMember = await getMember({
      databases,
      workspaceId: workspace.documents[0].$id,
      userId: c.get("user").$id,
    });

    if (isMember) {
      return c.json({
        data: {
          status: false,
          data: null,
        },
      });
    }

    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal("workspaceId", workspace.documents[0].$id),
    ]);

    return c.json({
      data: {
        status: true,
        data: {
          id: workspace.documents[0].$id,
          name: workspace.documents[0].name,
          imageUrl: workspace.documents[0].imageUrl,
          members: members.total,
        },
      },
    });
  })
  .get("/:workspaceId/analytics", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    const { workspaceId } = c.req.param();

    const existingWorkspace = await databases.getDocument<WorkspaceType>(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId
    );

    if (!existingWorkspace) {
      return c.json({ error: "Workspace not found." }, 404);
    }

    const member = await getMember({
      databases,
      workspaceId: existingWorkspace.$id,
      userId: user.$id,
    });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    const thisMonthProjects = await databases.listDocuments(
      DATABASE_ID,
      PROJECTS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthProjects = await databases.listDocuments(
      DATABASE_ID,
      PROJECTS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    );

    const projectCount = thisMonthProjects.total;
    const projectDifference = projectCount - lastMonthProjects.total;

    const thisMonthTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    );

    const taskCount = thisMonthTasks.total;
    const taskDifference = taskCount - lastMonthTasks.total;

    const thisMonthAssignedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.equal("assigneId", member.$id),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthAssignedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.equal("assigneId", member.$id),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    );

    const taskAssignedCount = thisMonthAssignedTasks.total;
    const taskAssignedDifference =
      taskAssignedCount - lastMonthAssignedTasks.total;

    const thisMonthIncompleteTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.notEqual("status", TaksStatus.DONE),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthIncompleteTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.notEqual("status", TaksStatus.DONE),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    );

    const taskIncompleteCount = thisMonthIncompleteTasks.total;
    const taskIncompleteDifference =
      taskIncompleteCount - lastMonthIncompleteTasks.total;

    const thisMonthCompletedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.equal("status", TaksStatus.DONE),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthCompletedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.equal("status", TaksStatus.DONE),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    );

    const taskCompletedCount = thisMonthCompletedTasks.total;
    const taskCompletedDifference =
      taskCompletedCount - lastMonthCompletedTasks.total;

    const thisMonthOverdueTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.notEqual("status", TaksStatus.DONE),
        Query.lessThan("dueDate", now.toISOString()),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthOverdueTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.notEqual("status", TaksStatus.DONE),
        Query.lessThan("dueDate", now.toISOString()),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    );

    const taskOverdueCount = thisMonthOverdueTasks.total;
    const taskOverdueDifference =
      taskOverdueCount - lastMonthOverdueTasks.total;

    return c.json({
      data: {
        projectCount,
        projectDifference,
        taskCount,
        taskDifference,
        taskAssignedCount,
        taskAssignedDifference,
        taskIncompleteCount,
        taskIncompleteDifference,
        taskCompletedCount,
        taskCompletedDifference,
        taskOverdueCount,
        taskOverdueDifference,
      },
    });
  })
  .get("/:workspaceId/dashboard", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");
    const { users } = await createAdminClient();

    const { workspaceId } = c.req.param();

    const existingWorkspace = await databases.getDocument<WorkspaceType>(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId
    );

    if (!existingWorkspace) {
      return c.json({ error: "Workspace not found." }, 404);
    }

    const member = await getMember({
      databases,
      workspaceId: existingWorkspace.$id,
      userId: user.$id,
    });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const tasks = await databases.listDocuments<TaskType>(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.orderDesc("$createdAt"),
        Query.limit(5),
      ]
    );

    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal("workspaceId", workspaceId),
      Query.orderAsc("role"),
      Query.limit(3),
    ]);

    const populatedMembers = await Promise.all(
      members.documents.map(async (member) => {
        const user = await users.get(member.userId);

        return {
          ...member,
          name: user.name,
          email: user.email,
          role: member.role, // Add role to the return object
          owner: member.userId === user.$id,
        };
      })
    );

    const projects = await databases.listDocuments<ProjectType>(
      DATABASE_ID,
      PROJECTS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.orderDesc("$createdAt"),
        Query.limit(6),
      ]
    );

    const populatedProjects = await Promise.all(
      projects.documents.map(async (project) => {
        const taskCount = await databases.listDocuments<TaskType>(
          DATABASE_ID,
          TASKS_ID,
          [Query.equal("projectId", project.$id)]
        );

        return {
          ...project,
          taskCount: taskCount.total,
        };
      })
    );

    return c.json({
      data: {
        tasks: tasks,
        members: {
          ...members,
          documents: populatedMembers,
        },
        projects: { ...projects, documents: populatedProjects },
      },
    });
  });

export default app;
