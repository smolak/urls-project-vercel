import { initTRPC } from "@trpc/server";

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.create();

// Base router, middleware and procedure helpers
export const router = t.router;
export const middleware = t.middleware;
export const procedure = t.procedure;
