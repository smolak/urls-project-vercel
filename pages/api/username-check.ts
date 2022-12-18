import type { NextApiHandler } from "next";
import { StatusCodes } from "http-status-codes";
import { usernameCheckHandler } from "../../lib/user-profile-data/handlers/usernameCheckHandler";

const handler: NextApiHandler = async (req, res) => {
  const { method } = req;

  switch (method) {
    case "POST":
      await usernameCheckHandler(req, res);
      break;

    default:
      res.setHeader("Allow", ["POST"]);
      res.status(StatusCodes.METHOD_NOT_ALLOWED).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
