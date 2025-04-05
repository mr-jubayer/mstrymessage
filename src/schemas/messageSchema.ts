import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(20, { message: "Content must be at least 20 character" })
    .max(300, { message: "Content must be no longer 300 character" }),
});
