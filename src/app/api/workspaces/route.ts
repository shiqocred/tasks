import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config";
import { createSessionClient } from "@/lib/appwrite";
import { createWorkspaceSchema, MemberRole } from "@/lib/schemas";
import { generateInviteCode } from "@/lib/utils";
import { ID, Query } from "node-appwrite";

export const GET = async () => {
  try {
    const { user, databases } = await createSessionClient();

    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal("userId", user.$id),
    ]);

    if (members.total === 0)
      return Response.json({ data: { documents: [], total: 0 } });

    const workspaceIds = members.documents.map((member) => member.workspaceId);

    const workspaces = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACES_ID,
      [Query.orderDesc("$createdAt"), Query.contains("$id", workspaceIds)]
    );

    return Response.json({ data: workspaces });
  } catch (error) {
    console.log("Internal Error", error);
    return new Response("Internal Error", { status: 500 });
  }
};

export const POST = async (req: Request) => {
  try {
    const { user, databases } = await createSessionClient();

    const formData = await req.formData();
    const form = Object.fromEntries(formData);
    const { name, image } = createWorkspaceSchema.parse(form);

    const generateNewCode = generateInviteCode(6);

    const oldWorkspace = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACES_ID
    );

    const someCode = oldWorkspace.documents.some(
      (item) => item.inviteCode === generateNewCode
    );

    if (someCode)
      return new Response("Something went wrong, please try again", {
        status: 400,
      });

    let uploadImageUrl: string | undefined;

    if (image instanceof File) {
      const arrayBuffer = await image.arrayBuffer();

      uploadImageUrl = `data:${image.type};base64,${Buffer.from(
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

    return Response.json({ data: workspace });
  } catch (error) {
    console.log("Internal Error", error);
    return new Response("Internal Error", { status: 500 });
  }
};
