import { inferAsyncReturnType } from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { getSession } from "next-auth/react";

export async function createContext(options: trpcNext.CreateNextContextOptions) {
  const session = await getSession({ req: options.req });

  return {
    session,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
