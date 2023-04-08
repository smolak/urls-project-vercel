import { NextApiRequest, NextApiResponse } from "next";
import { StatusCodes } from "http-status-codes";
import { processFeedQueueItemHandler } from "../../../lib/feed-queue/handlers/process-feed-queue-item-handler";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case "GET":
      await processFeedQueueItemHandler(req, res);
      break;

    default:
      res.setHeader("Allow", ["GET"]);
      res.status(StatusCodes.METHOD_NOT_ALLOWED).end(`Method ${method} Not Allowed`);
  }
}
