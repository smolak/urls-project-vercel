import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { StatusCodes } from "http-status-codes";
import { object, string } from "yup";

import prisma from "../../../prisma";
import { sha1 } from "../../crypto/sha1";
import { EventType, triggerEvent } from "../../events-aggregator/triggerEvent";

const schema = object({
  url: string().url().required(),
});

export const createUrlHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getToken({ req });

  // No token?
  if (!token) {
    res.status(StatusCodes.FORBIDDEN);
    return;
  }

  const userId = token.sub as string;
  const { body } = req;

  // Is body payload OK?
  if (!schema.isValidSync(body)) {
    res.status(StatusCodes.NOT_ACCEPTABLE);
    return;
  }

  const { url } = body;
  const urlHash = sha1(url);

  // Check if there's a record for this hash
  const maybeUrl = await prisma.url.findUnique({
    where: {
      urlHash,
    },
  });

  // If there's one, attempt creating a userUrl entry
  if (maybeUrl) {
    // TODO: Perhaps IDEA#4

    try {
      await prisma.userUrl.create({
        data: {
          userId,
          urlId: maybeUrl.id,
        },
      });

      res.status(StatusCodes.CREATED).send({ url: maybeUrl.url });
    } catch (e) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Failed to store the URL, try again." });
    }

    return;
  }

  // If there isn't one
  try {
    // TODO: IDEA#5

    const urlInQueue = await prisma.urlQueue.create({
      data: {
        id: "will-be-created-by-middleware",
        rawUrl: url,
        rawUrlHash: urlHash,
        userId,
      },
    });

    // Broadcast event
    triggerEvent({
      type: EventType.URL_QUEUE_CREATED,
      data: {
        id: urlInQueue["id"],
      },
    });

    // Use the URL added to queue to immediately trigger processing this entry
  } catch (e) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Failed to store the URL, try again." });
  }
};
