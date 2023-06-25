import { Feed, Url, User, UserProfileData, UserUrl } from "@prisma/client";
import { Metadata } from "../../metadata/get-metadata";

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
  };
  userUrlId: UserUrl["id"];
};
