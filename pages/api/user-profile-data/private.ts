import { NextApiRequest, NextApiResponse } from "next";
import { StatusCodes } from "http-status-codes";

import {
  getPrivateUserProfileDataHandler,
  GetPrivateUserProfileDataResponse,
} from "../../../lib/user-profile-data/handlers/getPrivateUserProfileDataHandler";

export default async function handler(req: NextApiRequest, res: NextApiResponse<GetPrivateUserProfileDataResponse>) {
  const { method } = req;

  switch (method) {
    case "GET":
      await getPrivateUserProfileDataHandler(req, res);
      break;

    default:
      res.setHeader("Allow", ["GET"]);
      res.status(StatusCodes.METHOD_NOT_ALLOWED).end(`Method ${method} Not Allowed`);
  }
}
