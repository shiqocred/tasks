import { AUTH_COOKIE } from "@/features/auth/server/constants";
import { createAdminClient } from "@/lib/appwrite";
import { LoginSchema } from "@/lib/schemas";
import { cookies } from "next/headers";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { email, password } = LoginSchema.parse(body);
    const { account } = await createAdminClient();
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
