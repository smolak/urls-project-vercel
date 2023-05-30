import z from "zod";

export const apiKeySchema = z.string().min(40).trim();
