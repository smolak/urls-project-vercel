import { vi } from "vitest";
import { Logger } from "pino";
import { mockDeep } from "vitest-mock-extended";
import axios, { Axios } from "axios";

import { generateUrlQueueId } from "../../utils/generateUrlQueueId";
import { createUrlQueueItem } from "../../test/fixtures/urlQueue";
import { prismaMock } from "../../../../test/helpers/prismaSingleton";
import { processQueueItemHandlerFactory } from "./factory";
import { sha1 } from "../../../crypto/sha1";
import { compressMetadata } from "../../../metadata/compression";
import { createExampleMetadata } from "../../../../test/fixtures/exampleMetadata";
import { createUrlEntity } from "../../../../test/fixtures/urlEntity";
import { ID_PLACEHOLDER_REPLACED_BY_ID_GENERATOR } from "../../../../prisma/middlewares/generateModelId";

vi.mock("axios");
const mockedAxios = vi.mocked<Axios>(axios);

const getMetadata = vi.fn();
const logger = mockDeep<Logger>();

const urlQueueItemId = generateUrlQueueId();

describe("processQueueItemHandler", () => {
  beforeEach(() => {
    prismaMock.urlQueue.findFirstOrThrow.mockResolvedValue(createUrlQueueItem());
    getMetadata.mockReset();
  });

  describe("when url queue item is not to be found", () => {
    it("should not throw, handler is silent", async () => {
      // trigger any type of error that might occur in the handler
      prismaMock.urlQueue.findFirstOrThrow.mockRejectedValue(new Error("Item not found"));

      const handler = processQueueItemHandlerFactory({ getMetadata, logger });

      expect(async () => await handler({ id: generateUrlQueueId() })).not.toThrow();
    });

    it("should error log that fact", async () => {
      // trigger any type of error that might occur in the handler
      const error = new Error("Item not found");
      prismaMock.urlQueue.findFirstOrThrow.mockRejectedValue(error);

      const handler = processQueueItemHandlerFactory({ getMetadata, logger });
      await handler({ id: urlQueueItemId });

      expect(logger.error).toHaveBeenCalledWith(error);
    });
  });

  it("should look for item in queue, but only for one in processable status", async () => {
    const handler = processQueueItemHandlerFactory({ getMetadata, logger });
    await handler({ id: urlQueueItemId });

    const processableStatuses = ["NEW", "FAILED"];

    expect(prismaMock.urlQueue.findFirstOrThrow).toHaveBeenCalledWith({
      where: {
        id: urlQueueItemId,
        status: {
          in: processableStatuses,
        },
      },
    });
  });

  it("found item gets updated in terms of attempt count", async () => {
    const urlQueueItem = createUrlQueueItem();
    prismaMock.urlQueue.findFirstOrThrow.mockResolvedValue(urlQueueItem);

    const handler = processQueueItemHandlerFactory({ getMetadata, logger });
    await handler({ id: urlQueueItem.id });

    expect(prismaMock.urlQueue.update).toHaveBeenCalledWith({
      data: {
        attemptCount: urlQueueItem.attemptCount + 1,
      },
      where: {
        id: urlQueueItem.id,
      },
    });
  });

  describe("obtaining content type info (to see what kind of type of data that is)", () => {
    it("fetches the mime type of the URL", async () => {
      const urlQueueItem = createUrlQueueItem();

      const handler = processQueueItemHandlerFactory({ getMetadata, logger });
      await handler({ id: urlQueueItem.id });

      expect(mockedAxios.head).toHaveBeenCalledWith(urlQueueItem.rawUrl);
    });

    describe("when a website is detected", () => {
      beforeEach(() => {
        mockedAxios.head.mockResolvedValue({
          headers: {
            "content-type": "text/html; charset=utf-8",
          },
          // whatever else can be here, doesn't matter
        });
      });

      it("should fetch this website's metadata", async () => {
        const urlQueueItem = createUrlQueueItem();

        const handler = processQueueItemHandlerFactory({ getMetadata, logger });
        await handler({ id: urlQueueItem.id });

        expect(getMetadata).toHaveBeenCalledWith(urlQueueItem.rawUrl);
      });
    });

    describe("when anything other than a website is detected", () => {
      beforeEach(() => {
        mockedAxios.head.mockResolvedValue({
          headers: {
            "content-type": "image/png",
          },
          // whatever else can be here, doesn't matter
        });
      });

      it("should not obtain the metadata, as there is nothing to obtain it from", async () => {
        const urlQueueItem = createUrlQueueItem();

        const handler = processQueueItemHandlerFactory({ getMetadata, logger });
        await handler({ id: urlQueueItem.id });

        expect(getMetadata).not.toHaveBeenCalled();
      });
    });
  });

  describe("further processing is wrapped in transaction, either all succeed or none", () => {
    const urlEntity = createUrlEntity();
    const urlQueueItem = createUrlQueueItem();
    const exampleMetadata = createExampleMetadata({ contentType: undefined });
    const websiteContentType = "text/html; charset=utf-8";

    const getTransactionCallback = () => prismaMock.$transaction.mock.calls[0][0];

    beforeEach(() => {
      getMetadata.mockResolvedValue(exampleMetadata);

      // Make sure website is detected so that metadata can be fetched
      mockedAxios.head.mockResolvedValue({
        headers: {
          "content-type": websiteContentType,
        },
        // whatever else can be here, doesn't matter
      });

      prismaMock.urlQueue.findFirstOrThrow.mockResolvedValue(urlQueueItem);
      prismaMock.url.create.mockResolvedValue(urlEntity);
    });

    it("Url entity is created", async () => {
      const handler = processQueueItemHandlerFactory({ getMetadata, logger });
      await handler({ id: urlQueueItem.id });

      expect(prismaMock.$transaction).toHaveBeenCalled();

      // Triggering $transaction call. Don't know if it can be done otherwise.
      // TODO if it can
      const transactionCallback = getTransactionCallback();
      await transactionCallback(prismaMock);

      const expectedPayload = {
        data: {
          id: ID_PLACEHOLDER_REPLACED_BY_ID_GENERATOR,
          url: exampleMetadata.url,
          urlHash: sha1(exampleMetadata.url as string),
          title: exampleMetadata.title,
          description: exampleMetadata.description,
          metadata: compressMetadata({ ...exampleMetadata, contentType: "text/html; charset=utf-8" }),
        },
      };

      expect(prismaMock.url.create).toHaveBeenCalledWith(expectedPayload);
    });

    describe("when the URL has no metadata (to be parsed from, e.g. an image) or title/description are missing", () => {
      beforeEach(() => {
        mockedAxios.head.mockResolvedValue({
          headers: {
            "content-type": "image/png",
          },
          // whatever else can be here, doesn't matter
        });
      });

      it("should use default values for title and description", async () => {
        const handler = processQueueItemHandlerFactory({ getMetadata, logger });
        await handler({ id: urlQueueItem.id });

        const defaultTitleValueIfMissing = "";
        const defaultDescriptionValueIfMissing = "";

        expect(prismaMock.$transaction).toHaveBeenCalled();

        // Triggering $transaction call. Don't know if it can be done otherwise.
        // TODO if it can
        const transactionCallback = prismaMock.$transaction.mock.calls[0][0];
        await transactionCallback(prismaMock);

        const expectedPayload = {
          data: {
            id: ID_PLACEHOLDER_REPLACED_BY_ID_GENERATOR,
            url: urlQueueItem.rawUrl,
            urlHash: sha1(urlQueueItem.rawUrl),
            title: defaultTitleValueIfMissing,
            description: defaultDescriptionValueIfMissing,
            metadata: compressMetadata({ contentType: "image/png" }),
          },
        };

        expect(prismaMock.url.create).toHaveBeenCalledWith(expectedPayload);
      });
    });

    it("relationship between created url and user that added it is created", async () => {
      const handler = processQueueItemHandlerFactory({ getMetadata, logger });
      await handler({ id: urlQueueItem.id });

      expect(prismaMock.$transaction).toHaveBeenCalled();

      // Triggering $transaction call. Don't know if it can be done otherwise.
      // TODO if it can
      const transactionCallback = getTransactionCallback();
      await transactionCallback(prismaMock);

      expect(prismaMock.userUrl.create).toHaveBeenCalledWith({
        data: {
          userId: urlQueueItem.userId,
          urlId: urlEntity.id,
        },
      });
    });

    it("url in queue is marked as accepted (no future processing; entity can be deleted by separate job)", async () => {
      const handler = processQueueItemHandlerFactory({ getMetadata, logger });
      await handler({ id: urlQueueItem.id });

      expect(prismaMock.$transaction).toHaveBeenCalled();

      // Triggering $transaction call. Don't know if it can be done otherwise.
      // TODO if it can
      const transactionCallback = getTransactionCallback();
      await transactionCallback(prismaMock);

      const compressedMetadata = compressMetadata(exampleMetadata);

      expect(prismaMock.urlQueue.update).toHaveBeenCalledWith({
        data: {
          metadata: compressedMetadata,
          status: "ACCEPTED",
        },
        where: {
          id: urlQueueItem.id,
        },
      });
    });
  });
});
