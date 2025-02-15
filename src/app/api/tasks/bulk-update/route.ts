import { DATABASE_ID, TASKS_ID } from "@/config";
import { getMember } from "@/features/members/utils";
import { createSessionClient } from "@/lib/appwrite";
import { bulkTaskSchema, TaskType } from "@/lib/schemas";
import { Query } from "node-appwrite";

export const POST = async (req: Request) => {
  try {
    const { user, databases } = await createSessionClient();

    const body = await req.json();
    const { tasks } = bulkTaskSchema.parse(body);

    const taskToUpdate = await databases.listDocuments<TaskType>(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.contains(
          "$id",
          tasks.map((task) => task.$id)
        ),
      ]
    );

    const workspaceIds = new Set(
      taskToUpdate.documents.map((task) => task.workspaceId)
    );

    if (workspaceIds.size !== 1)
      return new Response("All tasks must belong to the same workspace", {
        status: 400,
      });

    const workspaceId = workspaceIds.values().next().value!;

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member) return new Response("Unauthorized", { status: 401 });

    const updatedTasks = await Promise.all(
      tasks.map(async (task) => {
        const { $id, status, position } = task;
        return databases.updateDocument<TaskType>(DATABASE_ID, TASKS_ID, $id, {
          status,
          position,
        });
      })
    );

    return Response.json({ data: updatedTasks });
  } catch (error) {
    console.log("Internal Error", error);
    return new Response("Internal Error", { status: 500 });
  }
};
