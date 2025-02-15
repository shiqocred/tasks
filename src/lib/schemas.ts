import { Models } from "node-appwrite";
import { z } from "zod";

// TYPES

export type ProjectType = Models.Document & {
  name: string;
  imageUrl: string;
  workspaceId: string;
};

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

export type WorkspaceType = Models.Document & {
  name: string;
  imageUrl: string;
  inviteCode: string;
  userId: string;
};

// ENUMS

export enum MemberRole {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
}

export enum TaksStatus {
  BACKLOG = "BACKLOG",
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  DONE = "DONE",
}

// SCHEMAS

export const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string({ message: "Password required" }),
});

export const SignUpSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  name: z.string().trim().min(3, {
    message: "Password at least 3 character",
  }),
  password: z.string().min(6, {
    message: "Password at least 8 character",
  }),
});

export const JoinSchema = z.object({
  workspaceId: z.string().trim().min(1, { message: "Required" }),
  code: z.string().trim().min(1, { message: "Required" }),
});

export const createProjectSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
  workspaceId: z.string(),
});

export const updateProjectSchema = z.object({
  name: z.string().trim().min(1, "Must be 1 or more characters").optional(),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
});

export const createTaskSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  status: z.nativeEnum(TaksStatus, { required_error: "Required" }),
  workspaceId: z.string().trim().min(1, "Required"),
  projectId: z.string().trim().min(1, "Required"),
  assigneId: z.string().trim().min(1, "Required"),
  description: z.string().optional(),
  dueDate: z.coerce.date(),
});

export const bulkTaskSchema = z.object({
  tasks: z.array(
    z.object({
      $id: z.string(),
      status: z.nativeEnum(TaksStatus),
      position: z.number().int().positive().min(1000).max(1_000_000),
    })
  ),
});

export const createWorkspaceSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
});

export const updateWorkspaceSchema = z.object({
  name: z.string().trim().min(1, "Must be 1 or more characters").optional(),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
});

export const membersSchema = z.object({
  role: z.nativeEnum(MemberRole),
  memberId: z.string(),
});

// QUERY

export const QueryTasks = z.object({
  workspaceId: z.string(),
  projectId: z.string().nullish(),
  assigneId: z.string().nullish(),
  status: z.nativeEnum(TaksStatus).nullish(),
  search: z.string().nullish(),
  dueDate: z.string().nullish(),
});
