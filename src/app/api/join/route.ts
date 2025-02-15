import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config";
import { getMember } from "@/features/members/utils";
import { createSessionClient } from "@/lib/appwrite";
import { JoinSchema, MemberRole, WorkspaceType } from "@/lib/schemas";
import { ID } from "node-appwrite";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { code, workspaceId } = JoinSchema.parse(body);
    const { user, databases } = await createSessionClient();

    const isMember = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (isMember) {
      return Response.json({ error: "Already a member" }, { status: 400 });
    }

    const workspace = await databases.getDocument<WorkspaceType>(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId
    );

    if (!workspace || workspace.inviteCode !== code) {
      return Response.json({ error: "Invalid invite code" }, { status: 400 });
    }

    await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
      workspaceId,
      userId: user.$id,
      role: MemberRole.MEMBER,
    });

    return Response.json({ data: workspace });
  } catch (error) {
    console.log("Internal Error", error);
    return new Response("Internal Error", { status: 500 });
  }
};
