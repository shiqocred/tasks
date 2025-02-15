import { createSessionClient } from "@/lib/appwrite";

export const GET = async () => {
  try {
    const { user } = await createSessionClient();

    return Response.json({
      data: {
        name: user.name,
        email: user.email,
      },
    });
  } catch {
    return new Response("Internal Error", { status: 500 });
  }
};
