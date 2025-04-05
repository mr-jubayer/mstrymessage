import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "Username must be at least 2 character")
  .max(20, "Username must be withing 20 character")
  .regex(/^[a-zA-Z0-9_-]+$/, "Username must be not includes special Character");

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 character" })
    .max(16, { message: "Password must be not that 16 character" }),
});
