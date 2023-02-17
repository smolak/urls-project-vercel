import { initTRPC, TRPCError } from "@trpc/server";
import { Context } from "./context";

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<Context>().create();

const isAuthenticated = t.middleware(({ next, ctx }) => {
  // I am not sure if checking for email is a good idea... Twitter had some problems getting it
  // when logging in using Twitter... ?
  // Perhaps checking ID will be better?
  if (!ctx.session?.user?.email) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }

  return next({
    ctx: {
      session: ctx.session,
    },
  });
});

// Base router, middleware and procedure helpers
export const router = t.router;
export const middleware = t.middleware;

export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthenticated);
