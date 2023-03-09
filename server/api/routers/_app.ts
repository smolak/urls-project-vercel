import { z } from "zod";
import { publicProcedure, createTRPCRouter } from "../trpc";

export const appRouter = createTRPCRouter({
  hello: publicProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .query(({ input }) => {
      return {
        greeting: `Hello, ${input.name}.`,
      };
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
