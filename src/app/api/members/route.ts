import { DATABASE_ID, MEMBERS_ID } from "@/config";
import { getMember } from "@/features/members/utils";
import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { type NextRequest } from "next/server";
import { Query } from "node-appwrite";
import { MemberRole } from "@/lib/schemas";
import { z } from "zod";

export const GET = async (req: NextRequest) => {
  try {
    const { users } = await createAdminClient();
    const { databases, user: currentUser } = await createSessionClient();

    const workspaceId = req.nextUrl.searchParams.get("workspaceId");

    if (!workspaceId) {
      return new Response("Workspace Id Required", { status: 400 });
    }

    const member = await getMember({
      databases,
      workspaceId,
      userId: currentUser.$id,
    });

    if (!member) {
      return new Response("Unauthorized", { status: 401 });
    }

    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal("workspaceId", workspaceId),
    ]);

    const populatedMembers = await Promise.all(
      members.documents.map(async (member) => {
        const user = await users.get(member.userId);

        return {
          ...member,
          name: user.name,
          email: user.email,
          role: member.role, // Add role to the return object
          owner: member.userId === currentUser.$id,
        };
      })
    );

    return Response.json({
      data: {
        ...members,
        documents: populatedMembers,
      },
    });
  } catch (error) {
    console.log("Internal Error", error);
    return new Response("Internal Error", { status: 500 });
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    const { memberId } = await req.json();
    const { databases, user } = await createSessionClient();

    const memberToDelete = await databases.getDocument(
      DATABASE_ID,
      MEMBERS_ID,
      memberId
    );

    const allMembersInWorkspace = await databases.listDocuments(
      DATABASE_ID,
      MEMBERS_ID,
      [Query.equal("workspaceId", memberToDelete.workspaceId)]
    );

    const member = await getMember({
      databases,
      userId: user.$id,
      workspaceId: memberToDelete.workspaceId,
    });

    if (
      !member ||
      (member.$id !== memberToDelete.$id && member.role !== MemberRole.ADMIN)
    ) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (allMembersInWorkspace.total === 1) {
      return new Response("Cannot delete the only member", { status: 400 });
    }

    await databases.deleteDocument(DATABASE_ID, MEMBERS_ID, memberId);

    return Response.json({ data: { $id: memberToDelete.$id } });
  } catch (error) {
    console.log("Internal Error", error);
    return new Response("Internal Error", { status: 500 });
  }
};

export const PATCH = async (req: NextRequest) => {
  try {
    const { databases, user } = await createSessionClient();

    const body = await req.json();
    const { role, memberId } = z
      .object({ role: z.nativeEnum(MemberRole), memberId: z.string() })
      .parse(body);

    const memberToUpdate = await databases.getDocument(
      DATABASE_ID,
      MEMBERS_ID,
      memberId
    );

    const allMembersInWorkspace = await databases.listDocuments(
      DATABASE_ID,
      MEMBERS_ID,
      [Query.equal("workspaceId", memberToUpdate.workspaceId)]
    );

    const member = await getMember({
      databases,
      userId: user.$id,
      workspaceId: memberToUpdate.workspaceId,
    });

    if (!member || member.role !== MemberRole.ADMIN) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (allMembersInWorkspace.total === 1) {
      return new Response("Cannot downgrade the only member", { status: 400 });
    }

    await databases.updateDocument(DATABASE_ID, MEMBERS_ID, memberId, {
      role,
    });

    return Response.json({ data: { $id: memberToUpdate.$id } });
  } catch (error) {
    console.log("Internal Error", error);
    return new Response("Internal Error", { status: 500 });
  }
};
