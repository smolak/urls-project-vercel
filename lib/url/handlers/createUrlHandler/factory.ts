import { StatusCodes } from "http-status-codes";
import { createUrlHandlerPayloadSchema } from "./payload";
import { sha1 } from "../../../crypto/sha1";
import prisma from "../../../../prisma";
import { EventType, TriggerEvent } from "../../../events-aggregator/triggerEvent";
import { CreateUrlHandler } from "./index";
import { ID_PLACEHOLDER_REPLACED_BY_ID_GENERATOR } from "../../../../prisma/middlewares/generateModelId";
import { Logger } from "pino";
import { generateRequestId } from "../../../shared/utils/generateRequestId";
import { GetToken } from "../../../auth/models/GetToken";

interface Params {
  getToken: GetToken;
  logger: Logger;
  triggerEvent: TriggerEvent;
}

type CreateUrlHandlerFactory = ({ getToken, logger, triggerEvent }: Params) => CreateUrlHandler;

const actionType = "createUrlHandler";

export const createUrlHandlerFactory: CreateUrlHandlerFactory =
  ({ getToken, logger, triggerEvent }) =>
  async (req, res) => {
    const token = await getToken({ req });
    const requestId = generateRequestId();

    logger.info({ requestId, actionType }, "Creating URL initiated.");

    // No token?
    if (!token) {
      logger.warn({ requestId, actionType }, "Not logged in.");

      res.status(StatusCodes.FORBIDDEN);
      return;
    }

    const userId = token.sub as string;
    const { body } = req;

    // Is body payload OK?
    const result = createUrlHandlerPayloadSchema.safeParse(body);

    if (!result.success) {
      logger.error({ requestId, actionType }, "Body validation error.");

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
            id: ID_PLACEHOLDER_REPLACED_BY_ID_GENERATOR,
            userId,
            urlId: maybeUrl.id,
          },
        });

        logger.info({ requestId, actionType, url }, "URL exists, added to user.");

        res.status(StatusCodes.CREATED);
        res.send({ url: maybeUrl.url });

        return;
      }

      // If there isn't one
      // TODO: IDEA#5
      const urlInQueue = await prisma.urlQueue.create({
        data: {
          id: ID_PLACEHOLDER_REPLACED_BY_ID_GENERATOR,
          rawUrl: url,
          rawUrlHash: urlHash,
          userId,
        },
      });

      logger.info({ requestId, actionType, url }, "URL added to queue.");

      await triggerEvent({
        type: EventType.URL_QUEUE_CREATED,
        data: {
          urlQueueId: urlInQueue["id"],
          requestId,
        },
      });

      logger.info({ requestId }, "Success.");

      res.status(StatusCodes.CREATED);
      res.json({ urlQueueId: urlInQueue.id });
    } catch (error) {
      logger.error({ requestId, actionType, error }, "Failed to store the URL.");

      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
      res.json({ error: "Failed to store the URL, try again." });
    }
  };
