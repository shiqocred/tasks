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
  } catch (error) {
    console.log("Internal Error", error);
    return new Response("Unauthorized", { status: 401 });
  }
};
