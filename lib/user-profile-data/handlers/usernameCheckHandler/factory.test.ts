import { Logger } from "pino";
import { mockDeep } from "vitest-mock-extended";
import { NextApiRequest, NextApiResponse } from "next";
import { StatusCodes } from "http-status-codes";

import { prismaMock } from "../../../../test/helpers/prismaSingleton";

import { usernameCheckHandlerFactory } from "./factory";
import { expect } from "vitest";
import { normalizeUsername } from "../../utils/normalizeUsername";
import { createUserProfileData } from "../../../../test/fixtures/userProfileData";
import { createToken } from "../../../../test/fixtures/token";

const getToken = vi.fn();

const logger = mockDeep<Logger>();
const reqMock = mockDeep<NextApiRequest>();
const resMock = mockDeep<NextApiResponse>();

resMock.status.mockName("res.status");
resMock.json.mockName("res.json");

const USERNAME_TO_CHECK = "Jacek";

describe("usernameCheckHandlerFactory", () => {
  beforeEach(() => {
    vi.resetAllMocks();

    getToken.mockResolvedValue(createToken());
  });

  it("returns created handler", () => {
    const handler = usernameCheckHandlerFactory({ getToken, logger });

    expect(handler).toBeTypeOf("function");
  });

  describe("requires the user to be authenticated", () => {
    it("should try to get the user's token from request object", async () => {
      const handler = usernameCheckHandlerFactory({ getToken, logger });
      await handler(reqMock, resMock);

      expect(getToken).toHaveBeenCalledWith({ req: reqMock });
    });

    it("should send FORBIDDEN status if user is not authenticated", async () => {
      getToken.mockResolvedValue(null);

      const handler = usernameCheckHandlerFactory({ getToken, logger });
      await handler(reqMock, resMock);

      expect(resMock.status).toHaveBeenCalledWith(StatusCodes.FORBIDDEN);
    });
  });

  describe("body validation", () => {
    beforeEach(() => {
      reqMock.body = { username: USERNAME_TO_CHECK };
    });

    it("should send NOT_ACCEPTABLE status if `username` is not valid", async () => {
      reqMock.body = { username: "" };

      const handler = usernameCheckHandlerFactory({ getToken, logger });
      await handler(reqMock, resMock);

      expect(resMock.status).toHaveBeenCalledWith(StatusCodes.NOT_ACCEPTABLE);
    });
  });

  describe("username check", () => {
    beforeEach(() => {
      reqMock.body = { username: USERNAME_TO_CHECK };
    });

    it("should look for username existence using normalized value", async () => {
      const handler = usernameCheckHandlerFactory({ getToken, logger });
      await handler(reqMock, resMock);

      const usernameNormalized = normalizeUsername(USERNAME_TO_CHECK);

      expect(prismaMock.userProfileData.findUnique).toHaveBeenCalledWith({
        where: {
          usernameNormalized,
        },
      });
    });

    describe("when passed username already exists in the DB", () => {
      const userProfileData = createUserProfileData({ username: USERNAME_TO_CHECK });

      beforeEach(() => {
        prismaMock.userProfileData.findUnique.mockResolvedValue(userProfileData);
      });

      it("should return information that this username is not available", async () => {
        const handler = usernameCheckHandlerFactory({ getToken, logger });
        await handler(reqMock, resMock);

        expect(resMock.status).toHaveBeenCalledWith(200);
        expect(resMock.json).toHaveBeenCalledWith({ usernameAvailable: false });
      });
    });

    describe("when passed username does not exist in the DB", () => {
      beforeEach(() => {
        prismaMock.userProfileData.findUnique.mockResolvedValue(null);
      });

      it("should return information that this username is available", async () => {
        const handler = usernameCheckHandlerFactory({ getToken, logger });
        await handler(reqMock, resMock);

        expect(resMock.status).toHaveBeenCalledWith(200);
        expect(resMock.json).toHaveBeenCalledWith({ usernameAvailable: true });
      });
    });
  });
});
