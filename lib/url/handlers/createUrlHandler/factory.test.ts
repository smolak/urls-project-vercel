import { mockDeep } from "vitest-mock-extended";
import { NextApiRequest, NextApiResponse } from "next";
import { StatusCodes } from "http-status-codes";

import { generateUserId } from "../../../user/utils/generateUserId";
import { prismaMock } from "../../../../test/helpers/prismaSingleton";
import { sha1 } from "../../../crypto/sha1";
import { createUrlEntity } from "../../../../test/fixtures/urlEntity";
import { EventType } from "../../../events-aggregator/triggerEvent";
import { createUrlQueue } from "../../../../test/fixtures/urlQueue";

import { createUrlHandlerFactory } from "./factory";
import { ID_PLACEHOLDER_REPLACED_BY_ID_GENERATOR } from "../../../../prisma/middlewares/generateModelId";

const userId = generateUserId();
const getToken = vi.fn();
const triggerEvent = vi.fn();

const reqMock = mockDeep<NextApiRequest>();
const resMock = mockDeep<NextApiResponse>();

const URL_TO_ADD = "https://urlshare.me";

describe("createUrlHandlerFactory", () => {
  beforeEach(() => {
    vi.resetAllMocks();

    const token = { sub: userId };
    getToken.mockResolvedValue(token);
  });

  it("returns created handler", () => {
    const handler = createUrlHandlerFactory({ getToken, triggerEvent });
  });

  describe("requires the user to be authenticated", () => {
    it("should try to get the user's token from request object", async () => {
      const handler = createUrlHandlerFactory({ getToken, triggerEvent });
      await handler(reqMock, resMock);

      expect(getToken).toHaveBeenCalledWith({ req: reqMock });
    });

    it("should send FORBIDDEN status if user is not authenticated", async () => {
      getToken.mockResolvedValue(null);

      const handler = createUrlHandlerFactory({ getToken, triggerEvent });
      await handler(reqMock, resMock);

      expect(resMock.status).toHaveBeenCalledWith(StatusCodes.FORBIDDEN);
    });
  });

  describe('requires body to have "url" passed in it', () => {
    beforeEach(() => {
      reqMock.body = { url: URL_TO_ADD };
    });

    it("should send NOT_ACCEPTABLE status if URL is not valid", async () => {
      reqMock.body = { url: 42 };

      const handler = createUrlHandlerFactory({ getToken, triggerEvent });
      await handler(reqMock, resMock);

      expect(resMock.status).toHaveBeenCalledWith(StatusCodes.NOT_ACCEPTABLE);
    });

    it("should check if given URL already exists in the DB", async () => {
      const handler = createUrlHandlerFactory({ getToken, triggerEvent });
      await handler(reqMock, resMock);

      expect(prismaMock.url.findUnique).toHaveBeenCalledWith({
        where: {
          urlHash: sha1(reqMock.body.url),
        },
      });
    });

    describe("when passed URL already exists in the DB", () => {
      const urlEntity = createUrlEntity({ url: URL_TO_ADD });

      beforeEach(() => {
        prismaMock.url.findUnique.mockResolvedValue(urlEntity);
      });

      it("should assign this URL to the user that attempts to add it", async () => {
        const handler = createUrlHandlerFactory({ getToken, triggerEvent });
        await handler(reqMock, resMock);

        expect(prismaMock.userUrl.create).toHaveBeenCalledWith({
          data: {
            userId,
            urlId: urlEntity.id,
          },
        });
      });

      describe("when assigning URL to the user succeeds", () => {
        it('should respond with CREATED status with "url" assigned', async () => {
          const handler = createUrlHandlerFactory({ getToken, triggerEvent });
          await handler(reqMock, resMock);

          expect(resMock.status).toHaveBeenCalledWith(StatusCodes.CREATED);
          expect(resMock.send).toHaveBeenCalledWith({ url: URL_TO_ADD });
        });
      });

      describe("when assigning URL to the user fails", () => {
        it("should respond with INTERNAL_SERVER_ERROR and an explanation", async () => {
          prismaMock.userUrl.create.mockRejectedValue(new Error("Something went wrong"));

          const handler = createUrlHandlerFactory({ getToken, triggerEvent });
          await handler(reqMock, resMock);

          expect(resMock.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
          expect(resMock.json).toHaveBeenCalledWith({ error: "Failed to store the URL, try again." });
        });
      });
    });

    describe("when passed URL does not exist in the DB", () => {
      beforeEach(() => {
        prismaMock.url.findUnique.mockResolvedValue(null);
      });

      it("should add the URL to the queue", async () => {
        const handler = createUrlHandlerFactory({ getToken, triggerEvent });
        await handler(reqMock, resMock);

        expect(prismaMock.urlQueue.create).toHaveBeenCalledWith({
          data: {
            id: ID_PLACEHOLDER_REPLACED_BY_ID_GENERATOR,
            rawUrl: URL_TO_ADD,
            rawUrlHash: sha1(URL_TO_ADD),
            userId,
          },
        });
      });

      describe("when adding the URL to the queue succeeds", () => {
        const urlQueue = createUrlQueue();

        beforeEach(() => {
          prismaMock.urlQueue.create.mockResolvedValue(urlQueue);
        });

        it("should trigger an event to handle that queue item", async () => {
          const handler = createUrlHandlerFactory({ getToken, triggerEvent });
          await handler(reqMock, resMock);

          expect(triggerEvent).toHaveBeenCalledWith({
            type: EventType.URL_QUEUE_CREATED,
            data: {
              id: urlQueue.id,
            },
          });
        });

        it("should respond with CREATED status with urlQueue id assigned", async () => {
          const handler = createUrlHandlerFactory({ getToken, triggerEvent });
          await handler(reqMock, resMock);

          expect(resMock.status).toHaveBeenCalledWith(StatusCodes.CREATED);
          expect(resMock.json).toHaveBeenCalledWith({ urlQueueId: urlQueue.id });
        });
      });

      describe("when adding the URL to the queue fails", () => {
        it("should respond with INTERNAL_SERVER_ERROR and an explanation", async () => {
          prismaMock.urlQueue.create.mockRejectedValue(new Error("Something went wrong"));

          const handler = createUrlHandlerFactory({ getToken, triggerEvent });
          await handler(reqMock, resMock);

          expect(resMock.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
          expect(resMock.json).toHaveBeenCalledWith({ error: "Failed to store the URL, try again." });
        });
      });
    });
  });
});
