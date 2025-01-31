import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config";
import { MemberRole } from "@/features/members/types";
import { getMember } from "@/features/members/utils";
import { WorkspaceType } from "@/features/workspaces/server/types";
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID } from "node-appwrite";
import { z } from "zod";

const app = new Hono().post(
  "/",
  sessionMiddleware,
  zValidator("json", z.object({ workspaceId: z.string(), code: z.string() })),
  async (c) => {
    const { code, workspaceId } = c.req.valid("json");

    const databases = c.get("databases");
    const user = c.get("user");

    const isMember = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (isMember) {
      return c.json({ error: "Already a member" }, 400);
    }

    const workspace = await databases.getDocument<WorkspaceType>(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId
    );

    if (!workspace || workspace.inviteCode !== code) {
      return c.json({ error: "Invalid invite code" }, 400);
    }

    await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
      workspaceId,
      userId: user.$id,
      role: MemberRole.MEMBER,
    });

    return c.json({ data: workspace });
  }
);

export default app;
