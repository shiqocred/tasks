import "server-only";

import { AUTH_COOKIE } from "@/features/auth/server/constants";
import { createAdminClient } from "@/lib/appwrite";
import { SignUpSchema } from "@/lib/schemas";
import { cookies } from "next/headers";
import { ID } from "node-appwrite";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { name, email, password } = SignUpSchema.parse(body);

    const { account } = await createAdminClient();
    await account.create(ID.unique(), email, password, name);

    const session = await account.createEmailPasswordSession(email, password);

    (await cookies()).set(AUTH_COOKIE, session.secret, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.log("Internal Error", error);
    return new Response("Invalid credentials", { status: 401 });
  }
};
