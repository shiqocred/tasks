import { z } from "zod";
import { TaksStatus } from "./types";

export const createTaskSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  status: z.nativeEnum(TaksStatus, { required_error: "Required" }),
  workspaceId: z.string().trim().min(1, "Required"),
  projectId: z.string().trim().min(1, "Required"),
  assigneId: z.string().trim().min(1, "Required"),
  description: z.string().optional(),
  dueDate: z.coerce.date(),
});
