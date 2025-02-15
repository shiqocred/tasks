import { DATABASE_ID, PROJECTS_ID } from "@/config";
import { getMember } from "@/features/members/utils";
import { createSessionClient } from "@/lib/appwrite";
import { createProjectSchema } from "@/lib/schemas";
import { NextRequest } from "next/server";
import { ID, Query } from "node-appwrite";

export const GET = async (req: NextRequest) => {
  try {
    const { user, databases } = await createSessionClient();

    const workspaceId = req.nextUrl.searchParams.get("workspaceId");

    if (!workspaceId)
      return new Response("Missing Workspace Id", { status: 400 });

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member) return new Response("unauthorized", { status: 401 });

    const projects = await databases.listDocuments(DATABASE_ID, PROJECTS_ID, [
      Query.equal("workspaceId", workspaceId),
      Query.orderDesc("$createdAt"),
    ]);

    return Response.json({ data: projects });
  } catch (error) {
    console.log("Internal Error", error);
    return new Response("Internal Error", { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const { user, databases } = await createSessionClient();

    const formData = await req.formData();
    const form = Object.fromEntries(formData);

    const { name, image, workspaceId } = createProjectSchema.parse(form);

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member) return new Response("unauthorized", { status: 401 });

    let uploadImageUrl: string | undefined;

    if (image instanceof File) {
      const arrayBuffer = await image.arrayBuffer();

      uploadImageUrl = `data:${image.type};base64,${Buffer.from(
        arrayBuffer
      ).toString("base64")}`;
    }

    const project = await databases.createDocument(
      DATABASE_ID,
      PROJECTS_ID,
      ID.unique(),
      {
        name,
        imageUrl: uploadImageUrl,
        workspaceId,
      }
    );

    return Response.json({ data: project });
  } catch (error) {
    console.log("Internal Error", error);
    return new Response("Internal Error", { status: 500 });
  }
};
