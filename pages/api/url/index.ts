import { NextApiRequest, NextApiResponse } from "next";
import { StatusCodes } from "http-status-codes";

import { createUrlHandler } from "../../../lib/url/handlers/createUrlHandler";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case "POST":
      await createUrlHandler(req, res);

      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(StatusCodes.METHOD_NOT_ALLOWED).end(`Method ${method} Not Allowed`);
  }
}
