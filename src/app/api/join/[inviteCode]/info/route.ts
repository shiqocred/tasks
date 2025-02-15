import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config";
import { getMember } from "@/features/members/utils";
import { createSessionClient } from "@/lib/appwrite";
import { WorkspaceType } from "@/lib/schemas";
import { Query } from "node-appwrite";

export const GET = async (
  req: Request,
  { params }: { params: Promise<{ inviteCode: string }> }
) => {
  try {
    const { databases, user } = await createSessionClient();

    const { inviteCode } = await params;

    const workspace = await databases.listDocuments<WorkspaceType>(
      DATABASE_ID,
      WORKSPACES_ID,
      [Query.equal("inviteCode", inviteCode)]
    );

    if (!workspace) return new Response("Invalid code", { status: 404 });

    const isMember = await getMember({
      databases,
      workspaceId: workspace.documents[0].$id,
      userId: user.$id,
    });

    if (isMember) {
      return Response.json({
        data: {
          status: false,
          data: null,
        },
      });
    }

    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal("workspaceId", workspace.documents[0].$id),
    ]);

    return Response.json({
      data: {
        status: true,
        data: {
          id: workspace.documents[0].$id,
          name: workspace.documents[0].name,
          imageUrl: workspace.documents[0].imageUrl,
          members: members.total,
        },
      },
    });
  } catch (error) {
    console.log("Internal Error", error);
    return new Response("Internal Error", { status: 500 });
  }
};
