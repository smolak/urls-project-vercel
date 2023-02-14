import { Feed, Url, User, UserProfileData, UserUrl } from "@prisma/client";
import { Metadata } from "../../metadata/getMetadata";

export type FeedVM = {
  id: Feed["id"];
  createdAt: Feed["createdAt"];
  user: {
    name: User["name"];
    image: User["image"];
    username: UserProfileData["username"];
  };
  url: {
    url: Url["url"];
    metadata: Metadata;
  };
  userUrlId: UserUrl["id"];
};
