import { Logger } from "pino";
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
import { expect } from "vitest";
import { createToken } from "../../../../test/fixtures/token";
import { createFeed } from "../../../../test/fixtures/feed";
import { createUserUrl } from "../../../../test/fixtures/userUrl";

const userId = generateUserId();
const getToken = vi.fn();
const triggerEvent = vi.fn();

triggerEvent.mockName("triggerEvent");

const logger = mockDeep<Logger>();
const reqMock = mockDeep<NextApiRequest>();
const resMock = mockDeep<NextApiResponse>();

resMock.status.mockName("res.status");
resMock.json.mockName("res.json");

const URL_TO_ADD = "https://urlshare.me";

describe("createUrlHandlerFactory", () => {
  beforeEach(() => {
    vi.resetAllMocks();

    getToken.mockResolvedValue(createToken({ sub: userId }));
  });

  it("returns created handler", () => {
    const handler = createUrlHandlerFactory({ getToken, logger, triggerEvent });

    expect(handler).toBeTypeOf("function");
  });

  describe("requires the user to be authenticated", () => {
    it("should try to get the user's token from request object", async () => {
      const handler = createUrlHandlerFactory({ getToken, logger, triggerEvent });
      await handler(reqMock, resMock);

      expect(getToken).toHaveBeenCalledWith({ req: reqMock });
    });

    it("should send FORBIDDEN status if user is not authenticated", async () => {
      getToken.mockResolvedValue(null);

      const handler = createUrlHandlerFactory({ getToken, logger, triggerEvent });
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

      const handler = createUrlHandlerFactory({ getToken, logger, triggerEvent });
      await handler(reqMock, resMock);

      expect(resMock.status).toHaveBeenCalledWith(StatusCodes.NOT_ACCEPTABLE);
    });

    it("should check if given URL already exists in the DB", async () => {
      const handler = createUrlHandlerFactory({ getToken, logger, triggerEvent });
      await handler(reqMock, resMock);

      expect(prismaMock.url.findUnique).toHaveBeenCalledWith({
        where: {
          urlHash: sha1(reqMock.body.url),
        },
      });
    });

    describe("when passed URL already exists in the DB", () => {
      const urlEntity = createUrlEntity({ url: URL_TO_ADD });
      const userUrlItem = createUserUrl({
        urlId: urlEntity.id,
        userId,
      });
      const feedEntity = createFeed({
        userId,
        userUrlId: userUrlItem.id,
      });
      const getTransactionCallback = () => prismaMock.$transaction.mock.calls[0][0];

      beforeEach(() => {
        prismaMock.url.findUnique.mockResolvedValue(urlEntity);
        prismaMock.userUrl.create.mockResolvedValue(userUrlItem);
        prismaMock.feed.create.mockResolvedValue(feedEntity);
      });

      it("should assign this URL to the user that attempts to add it", async () => {
        const handler = createUrlHandlerFactory({ getToken, logger, triggerEvent });
        await handler(reqMock, resMock);

        expect(prismaMock.$transaction).toHaveBeenCalled();

        // Triggering $transaction call. Don't know if it can be done otherwise.
        // TODO if it can
        const transactionCallback = getTransactionCallback();
        await transactionCallback(prismaMock);

        expect(prismaMock.userUrl.create).toHaveBeenCalledWith({
          data: {
            id: ID_PLACEHOLDER_REPLACED_BY_ID_GENERATOR,
            userId,
            urlId: urlEntity.id,
          },
        });
      });

      it("should add the user's url to the feed queue (so that it will appear on author's feed as well)", async () => {
        const handler = createUrlHandlerFactory({ getToken, logger, triggerEvent });
        await handler(reqMock, resMock);

        expect(prismaMock.$transaction).toHaveBeenCalled();

        // Triggering $transaction call. Don't know if it can be done otherwise.
        // TODO if it can
        const transactionCallback = getTransactionCallback();
        await transactionCallback(prismaMock);

        expect(prismaMock.feedQueue.create).toHaveBeenCalledWith({
          data: {
            id: ID_PLACEHOLDER_REPLACED_BY_ID_GENERATOR,
            userId,
            userUrlId: userUrlItem.id,
          },
        });
      });

      describe("when assigning URL to the user succeeds", () => {
        it('should respond with CREATED status with "url" assigned', async () => {
          const handler = createUrlHandlerFactory({ getToken, logger, triggerEvent });
          await handler(reqMock, resMock);

          expect(resMock.status).toHaveBeenCalledWith(StatusCodes.CREATED);
          expect(resMock.send).toHaveBeenCalledWith({ url: URL_TO_ADD });
        });
      });

      describe("when any operation within transaction fails", () => {
        // Sadly, I don't know how to make $transaction mock behave in the original manner,
        // so that it would use the error created by one of CRUD operations performed in it.
        // That is why I am mimicking the behaviour which is exactly that: when any CRUD operation
        // fails, $transaction rethrows.
        // TODO: fix this if possible so that the underlying CRUD operations throw and $transaction rethrows
        beforeEach(() => {
          prismaMock.$transaction.mockRejectedValue(new Error("Something went wrong when creating user url."));
        });

        it("should respond with INTERNAL_SERVER_ERROR and an explanation", async () => {
          const handler = createUrlHandlerFactory({ getToken, logger, triggerEvent });
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
        const handler = createUrlHandlerFactory({ getToken, logger, triggerEvent });
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
          const handler = createUrlHandlerFactory({ getToken, logger, triggerEvent });
          await handler(reqMock, resMock);

          expect(triggerEvent).toHaveBeenCalledWith({
            type: EventType.URL_QUEUE_CREATED,
            data: {
              urlQueueId: urlQueue.id,
              requestId: expect.anything(),
            },
          });
        });

        it("should respond with CREATED status with urlQueue id assigned", async () => {
          const handler = createUrlHandlerFactory({ getToken, logger, triggerEvent });
          await handler(reqMock, resMock);

          expect(resMock.status).toHaveBeenCalledWith(StatusCodes.CREATED);
          expect(resMock.json).toHaveBeenCalledWith({ urlQueueId: urlQueue.id });
        });

        it("should send responses as the very last thing", async () => {
          // It turned out that when response is called, anything after that is not executed.
          // This happens on Vercel, and not locally and was a cause of a ton of headaches for me.

          const handler = createUrlHandlerFactory({ getToken, logger, triggerEvent });
          await handler(reqMock, resMock);

          expect(resMock.status).toHaveBeenCalledAfter(triggerEvent);
          expect(resMock.json).toHaveBeenCalledAfter(triggerEvent);
        });
      });

      describe("when adding the URL to the queue fails", () => {
        it("should error log that fact", async () => {
          // trigger any type of error that might occur in the handler
          const error = new Error("Could not add URL");
          prismaMock.urlQueue.create.mockRejectedValue(error);

          const handler = createUrlHandlerFactory({ getToken, logger, triggerEvent });
          await handler(reqMock, resMock);

          expect(logger.error).toHaveBeenCalledWith(
            {
              actionType: "createUrlHandler",
              error,
              requestId: expect.anything(),
            },
            "Failed to store the URL."
          );
        });

        it("should respond with INTERNAL_SERVER_ERROR and an explanation", async () => {
          prismaMock.urlQueue.create.mockRejectedValue(new Error("Something went wrong"));

          const handler = createUrlHandlerFactory({ getToken, logger, triggerEvent });
          await handler(reqMock, resMock);

          expect(resMock.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
          expect(resMock.json).toHaveBeenCalledWith({ error: "Failed to store the URL, try again." });
        });
      });
    });
  });
});
