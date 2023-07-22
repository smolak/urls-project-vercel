import { Feed, Url, User, UserProfileData, UserUrl } from "@prisma/client";
import { Metadata } from "../../metadata/get-metadata";
import { RawFeedEntry } from "../prisma/get-user-feed";
import { decompressMetadata } from "../../metadata/compression";

export const toFeedVM = (entry: RawFeedEntry): FeedVM => {
  return {
    id: entry.feed_id,
    createdAt: entry.feed_createdAt,
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

export type FeedVM = {
  id: Feed["id"];
  createdAt: Feed["createdAt"];
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
