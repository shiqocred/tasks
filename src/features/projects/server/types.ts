import { Models } from "node-appwrite";

export type ProjectType = Models.Document & {
  name: string;
  imageUrl: string;
  workspaceId: string;
};
