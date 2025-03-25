import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config";
import { getMember } from "@/features/members/utils";
import { createSessionClient } from "@/lib/appwrite";
import { MemberRole, WorkspaceType } from "@/lib/schemas";
import { ID, Query } from "node-appwrite";

export const POST = async (
  req: Request,
  { params }: { params: Promise<{ inviteCode: string }> }
) => {
  try {
    const { inviteCode } = await params;
    const { user, databases } = await createSessionClient();

    const workspaces = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACES_ID,
      [Query.equal("inviteCode", inviteCode)]
    );

    if (!workspaces || workspaces.total <= 0) {
      return Response.json({ error: "Workspace not found" }, { status: 404 });
    }

    const workspace = workspaces.documents[0] as WorkspaceType;

    const isMember = await getMember({
      databases,
      workspaceId: workspace.$id,
      userId: user.$id,
    });

    if (isMember) {
      return Response.json({ error: "Already a member" }, { status: 400 });
    }

    await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
      workspaceId: workspace.$id,
      userId: user.$id,
      role: MemberRole.MEMBER,
    });

    return Response.json({ data: workspace });
  } catch (error) {
    console.log("Internal Error", error);
    return new Response("Internal Error", { status: 500 });
  }
};
