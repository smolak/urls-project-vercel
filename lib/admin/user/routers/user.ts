import { adminProtectedProcedure, createTRPCRouter } from "../../../../server/api/trpc";
import { User } from "@prisma/client";

export type UserEntry = Pick<User, "id" | "createdAt" | "updatedAt" | "name" | "email" | "role" | "image">;

const getUsers = adminProtectedProcedure.query<ReadonlyArray<UserEntry>>(
  async ({ ctx: { logger, requestId, prisma } }) => {
    const path = "user.getUsers";

    logger.info({ requestId, path }, "Fetch users.");

    const users = await prisma.user.findMany({
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        name: true,
        email: true,
        role: true,
        image: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    logger.info({ requestId, path }, "Users fetched.");

    return users;
  }
);

export const userRouter = createTRPCRouter({
  getUsers,
});

export type UserRouter = typeof userRouter;
