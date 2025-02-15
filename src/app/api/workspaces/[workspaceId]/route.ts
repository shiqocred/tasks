import { DATABASE_ID, PROJECTS_ID, TASKS_ID, WORKSPACES_ID } from "@/config";
import { getMember } from "@/features/members/utils";
import { createSessionClient } from "@/lib/appwrite";
import { MemberRole, updateWorkspaceSchema } from "@/lib/schemas";
import { Query } from "node-appwrite";

export const GET = async (
  req: Request,
  { params }: { params: Promise<{ workspaceId: string }> }
) => {
  try {
    const { databases, user } = await createSessionClient();

    const { workspaceId } = await params;

    const workspace = await databases.getDocument(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId
    );

    if (!workspace) return new Response("Workspace not found", { status: 404 });

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member) return new Response("Unauthorized", { status: 401 });

    return Response.json({ data: workspace });
  } catch (error) {
    console.log("Internal Error", error);
    return new Response("Internal Error", { status: 500 });
  }
};

export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ workspaceId: string }> }
) => {
  try {
    const { databases, user } = await createSessionClient();

    const { workspaceId } = await params;

    const formData = await req.formData();
    const form = Object.fromEntries(formData);
    const { name, image } = updateWorkspaceSchema.parse(form);

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member || member.role !== MemberRole.ADMIN)
      return new Response("Unauthorized", { status: 401 });

    let uploadImageUrl: string | undefined;

    if (image instanceof File) {
      const arrayBuffer = await image.arrayBuffer();

      uploadImageUrl = `data:${image.type};base64,${Buffer.from(
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
    return Response.json({ data: workspace });
  } catch (error) {
    console.log("Internal Error", error);
    return new Response("Internal Error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ workspaceId: string }> }
) => {
  try {
    const { databases, user } = await createSessionClient();

    const { workspaceId } = await params;

    const existingWorkspace = await databases.getDocument(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId
    );

    if (!existingWorkspace)
      return new Response("Workspace not found", { status: 404 });

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member || member.role !== MemberRole.ADMIN)
      return new Response("Workspace not found", { status: 400 });

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

    return Response.json({ data: { $id: workspaceId } });
  } catch (error) {
    console.log("Internal Error", error);
    return new Response("Internal Error", { status: 500 });
  }
};
