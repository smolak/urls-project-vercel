import { NextApiRequest, NextApiResponse } from "next";
import { StatusCodes } from "http-status-codes";

import {
  userProfileDataUpsertHandler,
  UserProfileDataUpsertResponse,
} from "../../../lib/user/handlers/userProfileDataUpsertHandler";

export default async function handler(req: NextApiRequest, res: NextApiResponse<UserProfileDataUpsertResponse>) {
  const { method } = req;

  switch (method) {
    case "POST":
      await userProfileDataUpsertHandler(req, res);
      break;

    default:
      res.setHeader("Allow", ["POST"]);
      res.status(StatusCodes.METHOD_NOT_ALLOWED).end(`Method ${method} Not Allowed`);
  }
}
