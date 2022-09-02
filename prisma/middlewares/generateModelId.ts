import { Prisma } from "@prisma/client";
import { generateUserId } from "../../lib/user/utils/generateUserId";
import { generateSessionId } from "../../lib/session/utils/generateSessionId";
import { generateAccountId } from "../../lib/account/utils/generateAccountId";
import { generateUrlQueueId } from "../../lib/url-queue/utils/generateUrlQueueId";
import { generateUrlId } from "../../lib/url/utils/generateUrlId";

export const generateModelId: Prisma.Middleware = async (params: Prisma.MiddlewareParams, next) => {
  if (params.action === "create") {
    switch (params.model) {
      case "User":
        params.args.data.id = generateUserId();
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
    }
  }

  return await next(params);
};
