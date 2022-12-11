import { Logger } from "pino";
import { mockDeep } from "vitest-mock-extended";
import { NextApiRequest, NextApiResponse } from "next";
import { StatusCodes } from "http-status-codes";

import { prismaMock } from "../../../../test/helpers/prismaSingleton";

import { userProfileDataUpsertHandlerFactory } from "./factory";
import { expect } from "vitest";
import { normalizeUsername } from "../../utils/normalizeUsername";
import { createUserProfileData } from "../../../../test/fixtures/userProfileData";
import { createToken } from "../../../../test/fixtures/token";
import { generateUserId } from "../../utils/generateUserId";
import { ID_PLACEHOLDER_REPLACED_BY_ID_GENERATOR } from "../../../../prisma/middlewares/generateModelId";

const getToken = vi.fn();

const logger = mockDeep<Logger>();
const reqMock = mockDeep<NextApiRequest>();
const resMock = mockDeep<NextApiResponse>();

resMock.status.mockName("res.status");
resMock.json.mockName("res.json");

const USERNAME_TO_SET = "Jacek";
const userId = generateUserId();

describe("userProfileDataUpsertHandlerFactory", () => {
  beforeEach(() => {
    vi.resetAllMocks();

    getToken.mockResolvedValue(createToken({ sub: userId }));
  });

  it("returns created handler", () => {
    const handler = userProfileDataUpsertHandlerFactory({ getToken, logger });

    expect(handler).toBeTypeOf("function");
  });

  describe("requires the user to be authenticated", () => {
    it("should try to get the user's token from request object", async () => {
      const handler = userProfileDataUpsertHandlerFactory({ getToken, logger });
      await handler(reqMock, resMock);

      expect(getToken).toHaveBeenCalledWith({ req: reqMock });
    });

    it("should send FORBIDDEN status if user is not authenticated", async () => {
      getToken.mockResolvedValue(null);

      const handler = userProfileDataUpsertHandlerFactory({ getToken, logger });
      await handler(reqMock, resMock);

      expect(resMock.status).toHaveBeenCalledWith(StatusCodes.FORBIDDEN);
    });
  });

  describe("body validation", () => {
    it("should send NOT_ACCEPTABLE status if `username` is not valid", async () => {
      reqMock.body = { username: "" };

      const handler = userProfileDataUpsertHandlerFactory({ getToken, logger });
      await handler(reqMock, resMock);

      expect(resMock.status).toHaveBeenCalledWith(StatusCodes.NOT_ACCEPTABLE);
    });
  });

  describe("saving user profile data", () => {
    const userProfileData = createUserProfileData({
      userId,
      username: USERNAME_TO_SET,
    });

    beforeEach(() => {
      reqMock.body = { username: USERNAME_TO_SET };
      prismaMock.userProfileData.upsert.mockResolvedValue(userProfileData);
    });

    it("should fetch the current profile data, to see if it exists", async () => {
      const handler = userProfileDataUpsertHandlerFactory({ getToken, logger });
      await handler(reqMock, resMock);

      expect(prismaMock.userProfileData.findUnique).toHaveBeenCalledWith({
        where: {
          userId,
        },
        select: {
          // Select only ID, as we don't want to fetch all, especially API key and alike
          id: true,
        },
      });
    });

    describe("when profile data exists and payload contains `username`", () => {
      beforeEach(() => {
        prismaMock.userProfileData.findUnique.mockResolvedValue(userProfileData);
      });

      it("should return the information that it's not possible (username once set, can't be changed)", async () => {
        const handler = userProfileDataUpsertHandlerFactory({ getToken, logger });
        await handler(reqMock, resMock);

        const reason = "Username already set for this account. Once it's set, it can't be changed.";
        expect(resMock.status).toHaveBeenCalledWith(StatusCodes.CONFLICT);
        expect(resMock.json).toHaveBeenCalledWith({ reason });
      });
    });

    it("send upsert data, with limitation to username and usernameNormalized to be set only once", async () => {
      const handler = userProfileDataUpsertHandlerFactory({ getToken, logger });
      await handler(reqMock, resMock);

      expect(prismaMock.userProfileData.upsert).toHaveBeenCalledWith({
        where: {
          userId,
        },
        create: {
          id: ID_PLACEHOLDER_REPLACED_BY_ID_GENERATOR,
          userId,
          apiKey: "",
          username: USERNAME_TO_SET,
          usernameNormalized: normalizeUsername(USERNAME_TO_SET),
        },
        update: {
          apiKey: "",
        },
      });

      // IMPORTANT:
      // Those expects are intended as it is crucial that username / usernameNormalized will not be changed once set
      const payload = prismaMock.userProfileData.upsert.mock.calls[0][0];

      expect(payload.update).not.toHaveProperty("username");
      expect(payload.update).not.toHaveProperty("usernameNormalized");
    });

    it("should return information that this username is available", async () => {
      const handler = userProfileDataUpsertHandlerFactory({ getToken, logger });
      await handler(reqMock, resMock);

      expect(resMock.status).toHaveBeenCalledWith(StatusCodes.CREATED);
      expect(resMock.json).toHaveBeenCalledWith({ userProfileData });
    });
  });
});
