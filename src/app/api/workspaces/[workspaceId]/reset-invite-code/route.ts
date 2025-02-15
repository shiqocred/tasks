import { DATABASE_ID, WORKSPACES_ID } from "@/config";
import { getMember } from "@/features/members/utils";
import { createSessionClient } from "@/lib/appwrite";
import { MemberRole } from "@/lib/schemas";
import { generateInviteCode } from "@/lib/utils";

export const POST = async (
  req: Request,
  { params }: { params: Promise<{ workspaceId: string }> }
) => {
  try {
    const { user, databases } = await createSessionClient();

    const { workspaceId } = await params;

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member || member.role !== MemberRole.ADMIN)
      return new Response("Unauthorized", { status: 401 });

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

    const workspace = await databases.updateDocument(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId,
      {
        inviteCode: generateNewCode,
      }
    );

    return Response.json({ data: workspace });
  } catch (error) {
    console.log("Internal Error", error);
    return new Response("Internal Error", { status: 500 });
  }
};
