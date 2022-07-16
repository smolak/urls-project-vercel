import { Prisma } from "../index";

import { generateUserId } from "../../lib/user/utils/generateUserId";
import { generateSessionId } from "../../lib/session/utils/generateSessionId";
import { generateAccountId } from "../../lib/account/utils/generateAccountId";

export const generateModelIdForSeed: Prisma.Middleware = async (params: Prisma.MiddlewareParams, next) => {
  if (params.action === "upsert") {
    switch (params.model) {
      case "User":
        params.args.create.id = generateUserId();
        break;

      case "Session":
        params.args.create.id = generateSessionId();
        break;

      case "Account":
        params.args.create.id = generateAccountId();
        break;

      default:
        // @ts-ignore
        throw new Error("Not supported model!", params.model);
        break;
    }
  }

  return await next(params);
};
