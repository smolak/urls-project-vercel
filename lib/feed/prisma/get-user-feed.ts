import { Feed, Url, User, UserProfileData, UserUrl } from "@prisma/client";
import prisma from "../../../prisma";
import { CompressedMetadata } from "../../metadata/compression";
import getConfig from "next/config";

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

export const getUserFeed = (userId: User["id"]) => {
  const itemsPerFetch = getConfig().serverRuntimeConfig.userFeedList.itemsPerFetch;

  return prisma.$queryRaw<ReadonlyArray<RawFeedEntry>>`
          SELECT User.name AS user_name, User.image AS user_image, UserProfileData.username AS user_username,
                 Feed.id AS feed_id, Feed.createdAt AS feed_createdAt, Url.url AS url_url, Url.metadata AS url_metadata,
                 UserUrl.id AS userUrl_id
          FROM Feed
          LEFT JOIN UserUrl ON Feed.userUrlId = UserUrl.id
          LEFT JOIN Url ON UserUrl.urlId = Url.id
          LEFT JOIN User ON UserUrl.userId = User.id
          LEFT JOIN UserProfileData ON User.id = UserProfileData.userId
          WHERE Feed.userId = ${userId}
          ORDER BY Feed.createdAt DESC
          LIMIT 0, ${itemsPerFetch}
      `;
};
