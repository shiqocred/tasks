import "server-only";

import { Users, Client, Account, Databases, Storage } from "node-appwrite";
import { cookies } from "next/headers";
import { AUTH_COOKIE } from "@/features/auth/server/constants";

export const clientAppwrite = () => {
  return new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);
};

export const createGuestClient = async () => {
  const client = clientAppwrite();

  const databases = new Databases(client);

  return {
    databases,
  };
};

export const createSessionClient = async () => {
  const cookie = await cookies();
  const client = clientAppwrite();

  const session = cookie.get(AUTH_COOKIE);

  if (!session?.value) {
    throw new Error("Unauthorized");
  }

  client.setSession(session.value);

  const account = new Account(client);
  const databases = new Databases(client);
  const storage = new Storage(client);

  const user = await account.get();

  return {
    account,
    databases,
    storage,
    user,
  };
};

export const createAdminClient = async () => {
  const client = clientAppwrite().setKey(process.env.NEXT_PUBLIC_APPWRITE_KEY!);

  return {
    get account() {
      return new Account(client);
    },
    get users() {
      return new Users(client);
    },
  };
};
