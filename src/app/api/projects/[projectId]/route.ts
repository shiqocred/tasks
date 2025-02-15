import { DATABASE_ID, PROJECTS_ID, TASKS_ID, WORKSPACES_ID } from "@/config";
import { getMember } from "@/features/members/utils";
import { createSessionClient } from "@/lib/appwrite";
import { ProjectType, updateProjectSchema } from "@/lib/schemas";
import { Query } from "node-appwrite";

export const GET = async (
  req: Request,
  { params }: { params: Promise<{ projectId: string }> }
) => {
  try {
    const { user, databases } = await createSessionClient();

    const { projectId } = await params;

    const project = await databases.getDocument<ProjectType>(
      DATABASE_ID,
      PROJECTS_ID,
      projectId
    );

    if (!project) return new Response("Project not found.", { status: 404 });

    const member = await getMember({
      databases,
      workspaceId: project.workspaceId,
      userId: user.$id,
    });

    if (!member) return new Response("Unauthorized", { status: 401 });

    const workspace = await databases.getDocument(
      DATABASE_ID,
      WORKSPACES_ID,
      project.workspaceId
    );

    return Response.json({
      data: {
        ...project,
        workspace: {
          $id: workspace.$id,
          name: workspace.name,
        },
      },
    });
  } catch (error) {
    console.log("Internal Error", error);
    return new Response("Internal Error", { status: 500 });
  }
};

export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ projectId: string }> }
) => {
  try {
    const { user, databases } = await createSessionClient();

    const { projectId } = await params;
    const formData = await req.formData();
    const form = Object.fromEntries(formData);

    const { name, image } = updateProjectSchema.parse(form);

    const existingProject = await databases.getDocument<ProjectType>(
      DATABASE_ID,
      PROJECTS_ID,
      projectId
    );

    if (!existingProject)
      return new Response("Invalid Project Id", { status: 400 });

    const member = await getMember({
      databases,
      workspaceId: existingProject.workspaceId,
      userId: user.$id,
    });

    if (!member) return new Response("Unauthorized", { status: 401 });

    let uploadImageUrl: string | undefined;

    if (image instanceof File) {
      const arrayBuffer = await image.arrayBuffer();

      uploadImageUrl = `data:image/png;base64,${Buffer.from(
        arrayBuffer
      ).toString("base64")}`;
    } else {
      uploadImageUrl = image;
    }

    const project = await databases.updateDocument(
      DATABASE_ID,
      PROJECTS_ID,
      projectId,
      {
        name,
        imageUrl: uploadImageUrl,
      }
    );
    return Response.json({ data: project });
  } catch (error) {
    console.log("Internal Error", error);
    return new Response("Internal Error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ projectId: string }> }
) => {
  try {
    const { user, databases } = await createSessionClient();

    const { projectId } = await params;

    const existingProject = await databases.getDocument<ProjectType>(
      DATABASE_ID,
      PROJECTS_ID,
      projectId
    );

    if (!existingProject)
      return new Response("Invalid Project Id", { status: 400 });

    const member = await getMember({
      databases,
      workspaceId: existingProject.workspaceId,
      userId: user.$id,
    });

    if (!member) return new Response("Unauthorized", { status: 401 });

    const existingTasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
      Query.equal("projectId", existingProject.$id),
    ]);

    Promise.all(
      existingTasks.documents.map(async (item) => {
        await databases.deleteDocument(DATABASE_ID, TASKS_ID, item.$id);
      })
    );

    await databases.deleteDocument(DATABASE_ID, PROJECTS_ID, projectId);

    return Response.json({ data: { $id: existingProject.$id } });
  } catch (error) {
    console.log("Internal Error", error);
    return new Response("Internal Error", { status: 500 });
  }
};
