import {
  DATABASE_ID,
  MEMBERS_ID,
  PROJECTS_ID,
  TASKS_ID,
  WORKSPACES_ID,
} from "@/config";
import { getMember } from "@/features/members/utils";
import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { ProjectType, TaskType, WorkspaceType } from "@/lib/schemas";
import { Query } from "node-appwrite";

export const GET = async (
  req: Request,
  { params }: { params: Promise<{ workspaceId: string }> }
) => {
  try {
    const { databases, user } = await createSessionClient();
    const { users } = await createAdminClient();

    const { workspaceId } = await params;

    const existingWorkspace = await databases.getDocument<WorkspaceType>(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId
    );

    if (!existingWorkspace)
      return new Response("Workspace not found.", { status: 404 });

    const member = await getMember({
      databases,
      workspaceId: existingWorkspace.$id,
      userId: user.$id,
    });

    if (!member) return new Response("Unauthorized.", { status: 401 });

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

    return Response.json({
      data: {
        tasks: tasks,
        members: {
          ...members,
          documents: populatedMembers,
        },
        projects: { ...projects, documents: populatedProjects },
      },
    });
  } catch (error) {
    console.log("analytics", error);
    return new Response("Internal Error", { status: 500 });
  }
};
