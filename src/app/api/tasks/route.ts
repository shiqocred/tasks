import { DATABASE_ID, MEMBERS_ID, PROJECTS_ID, TASKS_ID } from "@/config";
import { getMember } from "@/features/members/utils";
import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { createTaskSchema, QueryTasks, TaskType } from "@/lib/schemas";
import { NextRequest } from "next/server";
import { ID, Query } from "node-appwrite";

export const GET = async (req: NextRequest) => {
  try {
    const { users } = await createAdminClient();
    const { user, databases } = await createSessionClient();

    const searchParams = Object.fromEntries(req.nextUrl.searchParams);
    const { workspaceId, projectId, assigneId, status, search, dueDate } =
      QueryTasks.parse(searchParams);

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member) return new Response("Unauthorized", { status: 401 });

    const query = [
      Query.equal("workspaceId", workspaceId),
      Query.orderDesc("$createdAt"),
    ];

    if (projectId) {
      query.push(Query.equal("projectId", projectId));
    }
    if (assigneId && assigneId === "user-assigne") {
      query.push(Query.equal("assigneId", member.$id));
    } else if (assigneId && assigneId !== "user-assigne") {
      query.push(Query.equal("assigneId", assigneId));
    }
    if (status) {
      query.push(Query.equal("status", status));
    }
    if (dueDate) {
      query.push(Query.equal("dueDate", dueDate));
    }
    if (search) {
      query.push(Query.equal("name", search));
    }

    const tasks = await databases.listDocuments<TaskType>(
      DATABASE_ID,
      TASKS_ID,
      query
    );

    const projectIds = tasks.documents.map((task) => task.projectId);
    const assigneIds = tasks.documents.map((task) => task.assigneId);

    const projects = await databases.listDocuments(
      DATABASE_ID,
      PROJECTS_ID,
      projectIds.length > 0 ? [Query.contains("$id", projectIds)] : []
    );

    const members = await databases.listDocuments(
      DATABASE_ID,
      MEMBERS_ID,
      assigneIds.length > 0 ? [Query.contains("$id", assigneIds)] : []
    );

    const assignes = await Promise.all(
      members.documents.map(async (item) => {
        const user = await users.get(item.userId);

        return {
          ...item,
          name: user.name,
          email: user.email,
        };
      })
    );

    const populatedTasks = tasks.documents.map((task) => {
      const project = projects.documents.find(
        (item) => item.$id === task.projectId
      );
      const assigne = assignes.find((item) => item.$id === task.assigneId);

      return {
        ...task,
        project,
        assigne,
      };
    });

    return Response.json({ data: { ...tasks, documents: populatedTasks } });
  } catch (error) {
    console.log("Internal Error", error);
    return new Response("Internal Error", { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const { user, databases } = await createSessionClient();

    const body = await req.json();
    const { name, assigneId, dueDate, projectId, status, workspaceId } =
      createTaskSchema.parse(body);

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member) return new Response("Unauthorized", { status: 401 });

    const highestPosition = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("status", status),
        Query.equal("workspaceId", workspaceId),
        Query.orderAsc("position"),
        Query.limit(1),
      ]
    );

    const newPosition =
      highestPosition.documents.length > 0
        ? highestPosition.documents[0].position + 1000
        : 1000;

    const task = await databases.createDocument(
      DATABASE_ID,
      TASKS_ID,
      ID.unique(),
      {
        name,
        status,
        workspaceId,
        projectId,
        assigneId,
        dueDate,
        position: newPosition,
      }
    );

    return Response.json({ data: task });
  } catch (error) {
    console.log("Internal Error", error);
    return new Response("Internal Error", { status: 500 });
  }
};
