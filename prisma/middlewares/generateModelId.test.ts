import { expect, vi } from "vitest";
import { generateModelId } from "./generateModelId";
import { USER_ID_PREFIX } from "../../lib/user/utils/generateUserId";
import { SESSION_ID_PREFIX } from "../../lib/session/utils/generateSessionId";
import { ACCOUNT_ID_PREFIX } from "../../lib/account/utils/generateAccountId";
import { URL_QUEUE_ID_PREFIX } from "../../lib/url-queue/utils/generateUrlQueueId";
import { URL_ID_PREFIX } from "../../lib/url/utils/generateUrlId";
import { Prisma } from "@prisma/client";
import { USER_URL_ID_PREFIX } from "../../lib/user-url/utils/generateUserUrlId";
import {
  generateUserProfileDataId,
  USER_PROFILE_DATA_ID_PREFIX,
} from "../../lib/user-profile-data/utils/generateUserProfileDataId";

describe("generateModelId middleware", () => {
  describe('for "create" action', () => {
    describe('when model is "User"', () => {
      it("should generate ID prefixed for User model", async () => {
        const params = {
          action: "create",
          model: "User",
          args: {
            data: {
              // any user data
            },
          },
        } as Prisma.MiddlewareParams;
        const nextSpy = vi.fn();

        await generateModelId(params, nextSpy);

        expect(nextSpy).toHaveBeenCalledWith({
          ...params,
          args: {
            ...params.args,
            data: {
              ...params.args.data,
              id: expect.stringMatching(`^${USER_ID_PREFIX}`),
            },
          },
        });
      });
    });

    describe('when model is "UserProfileData"', () => {
      it("should generate ID prefixed for UserProfileData model", async () => {
        const params = {
          action: "create",
          model: "UserProfileData",
          args: {
            data: {
              // any user data
            },
          },
        } as Prisma.MiddlewareParams;
        const nextSpy = vi.fn();

        await generateModelId(params, nextSpy);

        expect(nextSpy).toHaveBeenCalledWith({
          ...params,
          args: {
            ...params.args,
            data: {
              ...params.args.data,
              id: expect.stringMatching(`^${USER_PROFILE_DATA_ID_PREFIX}`),
            },
          },
        });
      });
    });

    describe('when model is "Session"', () => {
      it("should generate ID prefixed for Session model", async () => {
        const params = {
          action: "create",
          model: "Session",
          args: {
            data: {
              // any session data
            },
          },
        } as Prisma.MiddlewareParams;
        const nextSpy = vi.fn();

        await generateModelId(params, nextSpy);

        expect(nextSpy).toHaveBeenCalledWith({
          ...params,
          args: {
            ...params.args,
            data: {
              ...params.args.data,
              id: expect.stringMatching(`^${SESSION_ID_PREFIX}`),
            },
          },
        });
      });
    });

    describe('when model is "Account"', () => {
      it("should generate ID prefixed for Account model", async () => {
        const params = {
          action: "create",
          model: "Account",
          args: {
            data: {
              // any account data
            },
          },
        } as Prisma.MiddlewareParams;
        const nextSpy = vi.fn();

        await generateModelId(params, nextSpy);

        expect(nextSpy).toHaveBeenCalledWith({
          ...params,
          args: {
            ...params.args,
            data: {
              ...params.args.data,
              id: expect.stringMatching(`^${ACCOUNT_ID_PREFIX}`),
            },
          },
        });
      });
    });

    describe('when model is "UrlQueue"', () => {
      it("should generate ID prefixed for UrlQueue model", async () => {
        const params = {
          action: "create",
          model: "UrlQueue",
          args: {
            data: {
              // any url queue data
            },
          },
        } as Prisma.MiddlewareParams;
        const nextSpy = vi.fn();

        await generateModelId(params, nextSpy);

        expect(nextSpy).toHaveBeenCalledWith({
          ...params,
          args: {
            ...params.args,
            data: {
              ...params.args.data,
              id: expect.stringMatching(`^${URL_QUEUE_ID_PREFIX}`),
            },
          },
        });
      });
    });

    describe('when model is "Url"', () => {
      it("should generate ID prefixed for Url model", async () => {
        const params = {
          action: "create",
          model: "Url",
          args: {
            data: {
              // any url data
            },
          },
        } as Prisma.MiddlewareParams;
        const nextSpy = vi.fn();

        await generateModelId(params, nextSpy);

        expect(nextSpy).toHaveBeenCalledWith({
          ...params,
          args: {
            ...params.args,
            data: {
              ...params.args.data,
              id: expect.stringMatching(`^${URL_ID_PREFIX}`),
            },
          },
        });
      });
    });

    describe('when model is "UserUrl"', () => {
      it("should generate ID prefixed for UserUrl model", async () => {
        const params = {
          action: "create",
          model: "UserUrl",
          args: {
            data: {
              // any url data
            },
          },
        } as Prisma.MiddlewareParams;
        const nextSpy = vi.fn();

        await generateModelId(params, nextSpy);

        expect(nextSpy).toHaveBeenCalledWith({
          ...params,
          args: {
            ...params.args,
            data: {
              ...params.args.data,
              id: expect.stringMatching(`^${USER_URL_ID_PREFIX}`),
            },
          },
        });
      });
    });
  });

  describe('for "upsert" action', () => {
    describe('when model is "UserProfileData"', () => {
      it("should generate ID prefixed for creation of UserProfileData model", async () => {
        const params = {
          action: "upsert",
          model: "UserProfileData",
          args: {
            create: {
              // any url data
            },
          },
        } as Prisma.MiddlewareParams;
        const nextSpy = vi.fn();

        await generateModelId(params, nextSpy);

        expect(nextSpy).toHaveBeenCalledWith({
          ...params,
          args: {
            ...params.args,
            create: {
              ...params.args.data,
              id: expect.stringMatching(`^${USER_PROFILE_DATA_ID_PREFIX}`),
            },
          },
        });
      });
    });
  });
});
