"use server";

import { DATABASE_ID, WORKSPACES_ID } from "@/config";
import { createGuestClient, createSessionClient } from "@/lib/appwrite";
import { WorkspaceType } from "@/lib/schemas";
import { Query } from "node-appwrite";

export const protect = async () => {
  try {
    const { account } = await createSessionClient();

    const user = await account.get();

    return user;
  } catch {
    return null;
  }
};

export const infoJoin = async (inviteCode: string) => {
  try {
    const { databases } = await createGuestClient();

    if (!inviteCode) {
      return {
        data: {
          status: false,
          data: null,
        },
      };
    }

    const workspace = await databases.listDocuments<WorkspaceType>(
      DATABASE_ID,
      WORKSPACES_ID,
      [Query.equal("inviteCode", inviteCode)]
    );

    if (workspace.total === 0) {
      return {
        data: {
          status: true,
          data: null,
        },
      };
    }

    return {
      data: {
        status: true,
        data: {
          id: workspace.documents[0].$id,
          name: workspace.documents[0].name,
          imageUrl: workspace.documents[0].imageUrl,
        },
      },
    };
  } catch {
    return null;
  }
};
