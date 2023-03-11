import { z } from "zod";
import { publicProcedure, createTRPCRouter } from "../trpc";

export const helloRouter = createTRPCRouter({
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

export type HelloRouter = typeof helloRouter;
