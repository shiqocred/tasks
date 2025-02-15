import {
  DATABASE_ID,
  MEMBERS_ID,
  PROJECTS_ID,
  TASKS_ID,
  WORKSPACES_ID,
} from "@/config";
import { getMember } from "@/features/members/utils";
import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { createTaskSchema, TaskType } from "@/lib/schemas";

export const GET = async (
  req: Request,
  { params }: { params: Promise<{ taskId: string }> }
) => {
  try {
    const { users } = await createAdminClient();
    const { databases, user: currentUser } = await createSessionClient();

    const { taskId } = await params;

    const task = await databases.getDocument<TaskType>(
      DATABASE_ID,
      TASKS_ID,
      taskId
    );

    const currentMember = await getMember({
      databases,
      workspaceId: task.workspaceId,
      userId: currentUser.$id,
    });

    if (!currentMember) return new Response("Unauthorized", { status: 401 });

    const project = await databases.getDocument(
      DATABASE_ID,
      PROJECTS_ID,
      task.projectId
    );
    const member = await databases.getDocument(
      DATABASE_ID,
      MEMBERS_ID,
      task.assigneId
    );
    const workspace = await databases.getDocument(
      DATABASE_ID,
      WORKSPACES_ID,
      task.workspaceId
    );

    const user = await users.get(member.userId);

    const assigne = {
      ...member,
      name: user.name,
      email: user.email,
    };

    return Response.json({
      data: {
        ...task,
        project,
        assigne,
        workspace,
      },
    });
  } catch (error) {
    console.log("Internal Error", error);
    return new Response("Internal Error", { status: 500 });
  }
};
export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ taskId: string }> }
) => {
  try {
    const { databases, user } = await createSessionClient();

    const { taskId } = await params;

    const body = await req.json();
    const { name, assigneId, dueDate, projectId, status, description } =
      createTaskSchema.partial().parse(body);

    const existingTask = await databases.getDocument<TaskType>(
      DATABASE_ID,
      TASKS_ID,
      taskId
    );

    if (!existingTask) return new Response("Task not found.", { status: 404 });

    const member = await getMember({
      databases,
      workspaceId: existingTask.workspaceId,
      userId: user.$id,
    });

    if (!member) return new Response("Unauthorized", { status: 401 });

    const task = await databases.updateDocument(DATABASE_ID, TASKS_ID, taskId, {
      name,
      status,
      projectId,
      assigneId,
      dueDate,
      description,
    });

    return Response.json({ data: task });
  } catch (error) {
    console.log("Internal Error", error);
    return new Response("Internal Error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ taskId: string }> }
) => {
  try {
    const { databases, user } = await createSessionClient();

    const { taskId } = await params;

    const task = await databases.getDocument<TaskType>(
      DATABASE_ID,
      TASKS_ID,
      taskId
    );

    if (!task) return new Response("Task not found.", { status: 404 });

    const member = await getMember({
      databases,
      workspaceId: task.workspaceId,
      userId: user.$id,
    });

    if (!member) return new Response("Unauthorized", { status: 401 });

    await databases.deleteDocument(DATABASE_ID, TASKS_ID, task.$id);

    return Response.json({ data: { $id: task.$id } });
  } catch (error) {
    console.log("Internal Error", error);
    return new Response("Internal Error", { status: 500 });
  }
};
