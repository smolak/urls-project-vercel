import { generateRssFeed } from "../utils/generate-rss-feed";
import { ServerResponse } from "http";
import { Feed, Url, UserProfileData, UserUrl } from "@prisma/client";
import getConfig from "next/config";
import prisma from "../../../prisma";
import { CompressedMetadata, decompressMetadata } from "../../metadata/compression";

const createTitle = (username: UserProfileData["username"]) => {
  if (username.slice(-1) === "s") {
    return `${username}' links`;
  }

  return `${username}'s links`;
};

type RequiredUserData = Pick<UserProfileData, "username" | "userId">;
type RssItemData = {
  userUrl_id: UserUrl["id"];
  feed_createdAt: Feed["createdAt"];
  url_url: Url["url"];
  url_metadata: CompressedMetadata;
};

const BASE_URL = "https://urlshare.me";

export async function generateRss({ username, userId }: RequiredUserData, res: ServerResponse) {
  const itemsPerUserChannel = getConfig().serverRuntimeConfig.rss.itemsPerUserChannel;
  const rssItems = await prisma.$queryRaw<ReadonlyArray<RssItemData>>`
          SELECT Feed.createdAt AS feed_createdAt, Url.url AS url_url, Url.metadata AS url_metadata
          FROM Feed
          LEFT JOIN UserUrl ON Feed.userUrlId = UserUrl.id
          LEFT JOIN Url ON UserUrl.urlId = Url.id
          WHERE Feed.userId = ${userId}
          ORDER BY Feed.createdAt DESC
          LIMIT 0, ${itemsPerUserChannel}
      `;

  const channel = {
    title: createTitle(username),
    link: `${BASE_URL}/${username}`,
    description: `Links added by ${username} @ urlshare.me`,
    items: rssItems.map((rssItem) => {
      const metadata = decompressMetadata(rssItem.url_metadata);

      return {
        title: metadata.title || "",
        description: metadata.description || "",
        link: rssItem.url_url,
        pubDate: new Date(rssItem.feed_createdAt).toUTCString(),
      };
    }),
  };

  const rss = generateRssFeed(channel).trim();

  res.setHeader("Content-Type", "text/xml");
  res.write(rss);
  res.end();
}
