import { createToken } from "../../../../test/fixtures/token";
import { prismaMock } from "../../../../test/helpers/prismaSingleton";
import { getUrlsHandlerFactory } from "./factory";
import { mockDeep } from "vitest-mock-extended";
import { NextApiRequest, NextApiResponse } from "next";
import { generateUserId } from "../../../user/utils/generateUserId";
import { createUrlEntity } from "../../../../test/fixtures/urlEntity";
import { createUserUrl } from "../../../../test/fixtures/userUrl";
import { createUser } from "../../../../test/fixtures/user";
import { CompressedMetadata, decompressMetadata } from "../../../metadata/compression";
import { toPublicUserDataVM } from "../../../user/models/PublicUserData.vm";
import { User, UserUrl } from "@prisma/client";
import { StatusCodes } from "http-status-codes";

const getToken = vi.fn();

const reqMock = mockDeep<NextApiRequest>();
const resMock = mockDeep<NextApiResponse>();

const adminUserId = generateUserId();
const user1Id = generateUserId();
const user2Id = generateUserId();

const userUrl1 = {
  ...createUserUrl({ userId: user1Id }),
  url: createUrlEntity(),
  user: createUser({ id: user1Id }),
};
const userUrl2 = {
  ...createUserUrl({ userId: user1Id }),
  url: createUrlEntity(),
  user: createUser({ id: user1Id }),
};
const userUrl3 = {
  ...createUserUrl({ userId: user2Id }),
  url: createUrlEntity(),
  user: createUser({ id: user2Id }),
};

const urlsCreatedByDifferentUsers = [userUrl1, userUrl2, userUrl3];

const toAdminUrlList = (data: { [x: string]: any; url: any; user: any }[]) =>
  data.map(({ url, user, ...userUrl }) => {
    return {
      userUrl,
      url: {
        ...url,
        metadata: decompressMetadata(url.metadata as CompressedMetadata),
      },
      user: toPublicUserDataVM(user),
    };
  });

describe("getUrlsHandlerFactory", () => {
  beforeEach(() => {
    vi.resetAllMocks();

    const token = createToken();
    getToken.mockResolvedValue(token);
  });

  it("returns created handler", () => {
    const handler = getUrlsHandlerFactory({ getToken });

    expect(handler).toBeTypeOf("function");
  });

  describe("requires the user to be authenticated", () => {
    beforeEach(() => {
      const userUrlData: UserUrl[] = [];
      prismaMock.userUrl.findMany.mockResolvedValue(userUrlData);
    });

    it("should send FORBIDDEN status if user is not authenticated", async () => {
      getToken.mockResolvedValue(null);

      const handler = getUrlsHandlerFactory({ getToken });
      await handler(reqMock, resMock);

      expect(resMock.status).toHaveBeenCalledWith(StatusCodes.FORBIDDEN);
    });

    it("should send FORBIDDEN status if user is not an admin", async () => {
      const notAnAdmin = createUser({ role: "USER" });
      getToken.mockResolvedValue(notAnAdmin);

      const handler = getUrlsHandlerFactory({ getToken });
      await handler(reqMock, resMock);

      expect(resMock.status).toHaveBeenCalledWith(StatusCodes.FORBIDDEN);
    });
  });

  describe('when a user has "admin" role', () => {
    beforeEach(() => {
      getToken.mockResolvedValue(createToken({ role: "ADMIN", sub: adminUserId }));

      // @ts-ignore
      prismaMock.userUrl.findMany.mockImplementation(({ include }) => {
        const userUrl = urlsCreatedByDifferentUsers.map(({ url, user, ...userUrl }) => {
          // @ts-ignore
          const userFields = Object.keys(include.user.select) as (keyof User)[];

          return {
            ...userUrl,
            url,
            user: userFields.reduce((userModel, field) => ({ ...userModel, [field]: user[field] }), {}),
          };
        });

        return Promise.resolve(userUrl);
      });
    });

    it("should fetch all urls created", async () => {
      const handler = getUrlsHandlerFactory({ getToken });
      await handler(reqMock, resMock);

      expect(prismaMock.userUrl.findMany).toHaveBeenCalledWith({
        include: {
          url: true,
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              createdAt: true,
            },
          },
        },
      });
    });

    it("responds with all urls created", async () => {
      const handler = getUrlsHandlerFactory({ getToken });
      await handler(reqMock, resMock);

      expect(resMock.json).toHaveBeenCalledWith(toAdminUrlList(urlsCreatedByDifferentUsers));
      expect(resMock.status).toHaveBeenCalledWith(200);
    });
  });
});
