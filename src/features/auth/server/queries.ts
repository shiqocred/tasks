"use server";

import { createSessionClient } from "@/lib/appwrite";

export const protect = async () => {
  try {
    const { account } = await createSessionClient();

    return await account.get();
  } catch {
    console.log("error");
    return null;
  }
};
