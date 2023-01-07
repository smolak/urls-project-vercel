import { NextApiRequest, NextApiResponse } from "next";
import { StatusCodes } from "http-status-codes";
import { isFollowingUserHandler } from "../../../lib/follow-user/handlers/isFollowingUser";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case "GET":
      await isFollowingUserHandler(req, res);
      break;

    default:
      res.setHeader("Allow", ["GET"]);
      res.status(StatusCodes.METHOD_NOT_ALLOWED).end(`Method ${method} Not Allowed`);
  }
}
