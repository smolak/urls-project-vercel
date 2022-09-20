import { GetTokenParams, JWT } from "next-auth/jwt";
import { StatusCodes } from "http-status-codes";
import { createUrlHandlerPayloadSchema } from "./payload";
import { sha1 } from "../../../crypto/sha1";
import prisma from "../../../../prisma";
import { EventType, TriggerEvent } from "../../../events-aggregator/triggerEvent";
import { CreateUrlHandler } from "./index";

type GetToken = (params: GetTokenParams) => Promise<JWT | null>;

interface Params {
  getToken: GetToken;
  triggerEvent: TriggerEvent;
}

export type CreateUrlHandlerFactory = ({ getToken, triggerEvent }: Params) => CreateUrlHandler;

export const createUrlHandlerFactory: CreateUrlHandlerFactory =
  ({ getToken, triggerEvent }) =>
  async (req, res) => {
    const token = await getToken({ req });

    // No token?
    if (!token) {
      res.status(StatusCodes.FORBIDDEN);
      return;
    }

    const userId = token.sub as string;
    const { body } = req;

    // Is body payload OK?
    const result = createUrlHandlerPayloadSchema.safeParse(body);

    if (!result.success) {
      res.status(StatusCodes.NOT_ACCEPTABLE);
      return;
    }

    const url = result.data.url;
    const urlHash = sha1(url);

    // Check if there's a record for this hash
    const maybeUrl = await prisma.url.findUnique({
      where: {
        urlHash,
      },
    });

    try {
      // If there's one, attempt creating a userUrl entry
      if (maybeUrl) {
        // TODO: Perhaps IDEA#4

        await prisma.userUrl.create({
          data: {
            userId,
            urlId: maybeUrl.id,
          },
        });

        res.status(StatusCodes.CREATED);
        res.send({ url: maybeUrl.url });

        return;
      }

      // If there isn't one
      // TODO: IDEA#5
      const urlInQueue = await prisma.urlQueue.create({
        data: {
          id: "will-be-created-by-middleware",
          rawUrl: url,
          rawUrlHash: urlHash,
          userId,
        },
      });

      res.status(StatusCodes.CREATED);
      res.json({ urlQueueId: urlInQueue.id });

      triggerEvent({
        type: EventType.URL_QUEUE_CREATED,
        data: {
          id: urlInQueue["id"],
        },
      });
    } catch (e) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
      res.json({ error: "Failed to store the URL, try again." });
    }
  };
