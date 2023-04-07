import { Prisma } from "@prisma/client";
import { generateUserId } from "../../lib/user/utils/generate-user-id";
import { generateSessionId } from "../../lib/session/utils/generate-session-id";
import { generateAccountId } from "../../lib/account/utils/generate-account-id";
import { generateUrlQueueId } from "../../lib/url-queue/utils/generate-url-queue-id";
import { generateUrlId } from "../../lib/url/utils/generate-url-id";
import { generateUserUrlId } from "../../lib/user-url/utils/generate-user-url-id";
import { generateUserProfileDataId } from "../../lib/user-profile-data/utils/generate-user-profile-data-id";
import { generateFeedId } from "../../lib/feed/utils/generate-feed-id";
import { generateFeedQueueId } from "../../lib/feed-queue/utils/generate-feed-queue-id";

export const ID_PLACEHOLDER_REPLACED_BY_ID_GENERATOR = "ID_PLACEHOLDER";

export const generateModelId: Prisma.Middleware = async (params: Prisma.MiddlewareParams, next) => {
  if (params.action === "upsert") {
    switch (params.model) {
      case "UserProfileData":
        params.args.create.id = generateUserProfileDataId();
        break;
    }
  }

  if (params.action === "createMany") {
    switch (params.model) {
      case "Feed":
        params.args.data = params.args.data.map((item: Prisma.FeedCreateManyInput) => {
          return {
            ...item,
            id: generateFeedId(),
          };
        });
        break;
    }
  }

  if (params.action === "create") {
    switch (params.model) {
      case "User":
        params.args.data.id = generateUserId();
        break;

      case "UserProfileData":
        params.args.data.id = generateUserProfileDataId();
        break;

      case "Session":
        params.args.data.id = generateSessionId();
        break;

      case "Account":
        params.args.data.id = generateAccountId();
        break;

      case "UrlQueue":
        params.args.data.id = generateUrlQueueId();
        break;

      case "Url":
        params.args.data.id = generateUrlId();
        break;

      case "UserUrl":
        params.args.data.id = generateUserUrlId();
        break;

      case "Feed":
        params.args.data.id = generateFeedId();
        break;

      case "FeedQueue":
        params.args.data.id = generateFeedQueueId();
        break;
    }
  }

  return await next(params);
};
