import { NextApiRequest, NextApiResponse } from "next";
import { StatusCodes } from "http-status-codes";

import prisma from "../../../prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case "GET":
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

      res.status(StatusCodes.OK).json(users);
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(StatusCodes.METHOD_NOT_ALLOWED).end(`Method ${method} Not Allowed`);
  }
}
