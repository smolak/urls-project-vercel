import z from "zod";

export type UsernameCheckHandlerPayload = z.infer<typeof usernameCheckHandlerPayloadSchema>;

const usernameValidation = z
  .string()
  .trim()
  .min(4, "Username cannot be shorter than 4 and longer than 15 characters.")
  .max(15, "Username cannot be shorter than 4 and longer than 15 characters.")
  .regex(/^[A-Za-z0-9_]+$/, "Only a-z, A-Z, 0-9 and _ characters allowed.");

export const usernameCheckHandlerPayloadSchema = z.object({
  username: usernameValidation,
});
