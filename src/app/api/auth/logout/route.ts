import { AUTH_COOKIE } from "@/features/auth/server/constants";
import { createSessionClient } from "@/lib/appwrite";
import { cookies } from "next/headers";

export const POST = async () => {
  try {
    const { account } = await createSessionClient();
    (await cookies()).delete(AUTH_COOKIE);
    await account.deleteSession("current");

    return Response.json({ success: true });
  } catch (error) {
    console.log("Internal Error", error);
    return new Response("Internal Server Error", { status: 400 });
  }
};
