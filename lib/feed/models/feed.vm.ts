import { Feed, Url, User, UserProfileData, UserUrl } from "@prisma/client";
import { RawFeedEntry } from "../prisma/get-user-feed";
import { decompressMetadata } from "../../metadata/compression";
import { Metadata } from "../../metadata/types";

export const toFeedVM = (entry: RawFeedEntry): FeedVM => {
  return {
    id: entry.feed_id,
    createdAt: entry.feed_createdAt.toISOString(),
    user: {
      image: entry.user_image,
      username: entry.user_username,
    },
    url: {
      url: entry.url_url,
      metadata: decompressMetadata(entry.url_metadata),
      likes: Number(entry.url_likes),
      liked: entry.feed_liked,
    },
    userUrlId: entry.userUrl_id,
  };
};

type ISODateString = string;

export type FeedVM = {
  id: Feed["id"];
  createdAt: ISODateString;
  user: {
    image: User["image"];
    username: UserProfileData["username"];
  };
  url: {
    url: Url["url"];
    metadata: Metadata;
    liked: Feed["liked"];
    likes: UserUrl["likes"];
  };
  userUrlId: UserUrl["id"];
};
