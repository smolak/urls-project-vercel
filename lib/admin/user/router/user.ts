import { createTRPCRouter } from "../../../../server/api/trpc";
import { getUsers } from "./procedures/get-users";

export const userRouter = createTRPCRouter({
  getUsers,
});

export type UserRouter = typeof userRouter;
