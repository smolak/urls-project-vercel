import { GetUserFeedsHandler } from "./index";
import { Logger } from "pino";
import { GetToken } from "../../../auth/models/GetToken";
import { generateRequestId } from "../../../request-id/utils/generateRequestId";
import { StatusCodes } from "http-status-codes";
import prisma from "../../../../prisma";
import { Feed, Url, User, UserProfileData, UserUrl } from "@prisma/client";
import { FeedVM } from "../../models/Feed.vm";
import { CompressedMetadata, decompressMetadata } from "../../../metadata/compression";
import getConfig from "next/config";

type Params = {
  logger: Logger;
  getToken: GetToken;
};

type GetUserFeedsHandlerFactory = (params: Params) => GetUserFeedsHandler;

type RawFeedEntry = {
  feed_id: Feed["id"];
  feed_createdAt: Feed["createdAt"];
  user_name: User["name"];
  user_username: UserProfileData["username"];
  user_image: User["image"];
  url_url: Url["url"];
  url_metadata: CompressedMetadata;
  userUrl_id: UserUrl["id"];
};

const actionType = "getUserFeedsHandler";

export const getUserFeedsHandlerFactory: GetUserFeedsHandlerFactory = ({ logger, getToken }) => {
  return async (req, res) => {
    const token = await getToken({ req });
    const requestId = generateRequestId();

    logger.info({ requestId, actionType }, "Fetching user's feed list.");

    // No token?
    if (!token) {
      logger.warn({ requestId, actionType }, "Not logged in.");

      res.status(StatusCodes.FORBIDDEN);
      return;
    }

    const userId = token.sub as string;

    try {
      const itemsPerFetch = getConfig().serverRuntimeConfig.userFeedList.itemsPerFetch;

      const feedRawEntries = await prisma.$queryRaw<ReadonlyArray<RawFeedEntry>>`
          SELECT User.name AS user_name, User.image AS user_image, UserProfileData.username AS user_username,
                 Feed.id AS feed_id, Feed.createdAt AS feed_createdAt, Url.url AS url_url, Url.metadata AS url_metadata,
                 UserUrl.id AS userUrl_id
          FROM Feed
          LEFT JOIN UserUrl ON Feed.userUrlId = UserUrl.id
          LEFT JOIN Url ON UserUrl.urlId = Url.id
          LEFT JOIN User ON UserUrl.userId = User.id
          LEFT JOIN UserProfileData ON User.id = UserProfileData.userId
          WHERE Feed.userId = ${userId}
          ORDER BY Feed.createdAt
          DESC LIMIT 0, ${itemsPerFetch}
      `;

      const feeds: ReadonlyArray<FeedVM> = feedRawEntries.map((entry) => {
        return {
          id: entry.feed_id,
          createdAt: entry.feed_createdAt,
          user: {
            name: entry.user_name,
            image: entry.user_image,
            username: entry.user_username,
          },
          url: {
            url: entry.url_url,
            metadata: decompressMetadata(entry.url_metadata),
          },
          userUrlId: entry.userUrl_id,
        };
      });

      logger.info({ requestId, actionType, userId }, "User's feed list fetched.");

      res.status(StatusCodes.OK);
      res.json({ feeds });
    } catch (error) {
      logger.error({ requestId, actionType, error }, "Failed to fetch user's feed list.");

      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
      res.json({ error: "Failed to fetch your feed list, try again." });
    }
  };
};
