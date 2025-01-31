import { Models } from "node-appwrite";

export enum TaksStatus {
  BACKLOG = "BACKLOG",
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  DONE = "DONE",
}

export type TaskType = Models.Document & {
  name: string;
  status: TaksStatus;
  assigneId: string;
  projectId: string;
  workspaceId: string;
  position: number;
  dueDate: string;
  description?: string;
};
