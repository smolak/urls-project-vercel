import z from "zod";

export type CreateUrlHandlerPayloadSchema = z.infer<typeof createUrlHandlerPayloadSchema>;

export const createUrlHandlerPayloadSchema = z.object({
  url: z
    .string()
    .trim()
    .url()
    .refine(
      (val) => val.startsWith("https://"),
      (val) => ({ message: `Only https:// URLs allowed at the moment. Passed URL: ${val}` })
    )
    .refine(
      (val) => val.length <= 500,
      (val) => ({ message: `Oh NOES! That URL is too long. Detected ${val.length} characters and max 500 is allowed.` })
    ),
});
