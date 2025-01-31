import { z } from "zod";

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
