import { vi } from "vitest";
import { Logger } from "pino";
import { mockDeep } from "vitest-mock-extended";
import https from "node:https";

import { generateUrlQueueId } from "../../utils/generateUrlQueueId";
import { createUrlQueueItem } from "../../test/fixtures/urlQueue";
import { prismaMock } from "../../../../test/helpers/prismaSingleton";
import { processQueueItemHandlerFactory } from "./factory";
import { sha1 } from "../../../crypto/sha1";
import { compressMetadata } from "../../../metadata/compression";
import { createExampleWebsiteMetadata, createExampleImageMetadata } from "../../../../test/fixtures/exampleMetadata";
import { createUrlEntity } from "../../../../test/fixtures/urlEntity";
import { ID_PLACEHOLDER_REPLACED_BY_ID_GENERATOR } from "../../../../prisma/middlewares/generateModelId";
import { generateRequestId } from "../../../shared/utils/generateRequestId";

vi.mock("node:https");
const mockedHttps = vi.mocked(https);

const fetchMetadata = vi.fn();
const logger = mockDeep<Logger>();
const requestId = generateRequestId();

describe("processQueueItemHandler", () => {
  beforeEach(() => {
    prismaMock.urlQueue.findFirstOrThrow.mockResolvedValue(createUrlQueueItem());
    fetchMetadata.mockReset();
  });

  describe("when url queue item is not to be found", () => {
    it("should not throw, handler is silent", async () => {
      // trigger any type of error that might occur in the handler
      prismaMock.urlQueue.findFirstOrThrow.mockRejectedValue(new Error("Item not found"));

      const handler = processQueueItemHandlerFactory({ fetchMetadata, logger });

      expect(async () => await handler({ urlQueueId: generateUrlQueueId(), requestId })).not.toThrow();
    });

    it("should error log that fact", async () => {
      // trigger any type of error that might occur in the handler
      const error = new Error("Item not found");
      prismaMock.urlQueue.findFirstOrThrow.mockRejectedValue(error);

      const handler = processQueueItemHandlerFactory({ fetchMetadata, logger });
      await handler({ urlQueueId: generateUrlQueueId(), requestId });

      expect(logger.error).toHaveBeenCalledWith(
        {
          error,
          requestId,
        },
        "Failed to process URL queue item."
      );
    });
  });

  it("should look for item in queue, but only for one in processable status", async () => {
    const handler = processQueueItemHandlerFactory({ fetchMetadata, logger });
    const urlQueueId = generateUrlQueueId();

    await handler({ urlQueueId });

    const processableStatuses = ["NEW", "FAILED"];

    expect(prismaMock.urlQueue.findFirstOrThrow).toHaveBeenCalledWith({
      where: {
        id: urlQueueId,
        status: {
          in: processableStatuses,
        },
      },
    });
  });

  it("found item gets updated in terms of attempt count", async () => {
    const urlQueueItem = createUrlQueueItem();
    prismaMock.urlQueue.findFirstOrThrow.mockResolvedValue(urlQueueItem);

    const handler = processQueueItemHandlerFactory({ fetchMetadata, logger });
    await handler({ urlQueueId: urlQueueItem.id, requestId });

    expect(prismaMock.urlQueue.update).toHaveBeenCalledWith({
      data: {
        attemptCount: urlQueueItem.attemptCount + 1,
      },
      where: {
        id: urlQueueItem.id,
      },
    });
  });

  it("fetches the metadata for the URL in question", async () => {
    const urlQueueItem = createUrlQueueItem();
    prismaMock.urlQueue.findFirstOrThrow.mockResolvedValue(urlQueueItem);

    const handler = processQueueItemHandlerFactory({ fetchMetadata, logger });
    const urlQueueId = generateUrlQueueId();

    await handler({ urlQueueId });

    expect(fetchMetadata).toHaveBeenCalledWith(urlQueueItem.rawUrl);
  });

  describe("further processing is wrapped in transaction, either all succeed or none", () => {
    const urlEntity = createUrlEntity();
    const urlQueueItem = createUrlQueueItem();
    const exampleMetadata = createExampleWebsiteMetadata({ contentType: undefined });

    const getTransactionCallback = () => prismaMock.$transaction.mock.calls[0][0];

    beforeEach(() => {
      fetchMetadata.mockResolvedValue(exampleMetadata);

      prismaMock.urlQueue.findFirstOrThrow.mockResolvedValue(urlQueueItem);
      prismaMock.url.create.mockResolvedValue(urlEntity);
    });

    it("Url entity is created", async () => {
      const handler = processQueueItemHandlerFactory({ fetchMetadata, logger });
      await handler({ urlQueueId: urlQueueItem.id, requestId });

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
          metadata: compressMetadata(exampleMetadata),
        },
      };

      expect(prismaMock.url.create).toHaveBeenCalledWith(expectedPayload);
    });

    describe("when the URL has no metadata (to be parsed from, e.g. an image) or title/description are missing", () => {
      const imageMetadata = createExampleImageMetadata();

      beforeEach(() => {
        fetchMetadata.mockResolvedValue(imageMetadata);
      });

      it("should use default values for title and description", async () => {
        const handler = processQueueItemHandlerFactory({ fetchMetadata, logger });
        await handler({ urlQueueId: urlQueueItem.id, requestId });

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
            metadata: compressMetadata(imageMetadata),
          },
        };

        expect(prismaMock.url.create).toHaveBeenCalledWith(expectedPayload);
      });
    });

    it("relationship between created url and user that added it is created", async () => {
      const handler = processQueueItemHandlerFactory({ fetchMetadata, logger });
      await handler({ urlQueueId: urlQueueItem.id, requestId });

      expect(prismaMock.$transaction).toHaveBeenCalled();

      // Triggering $transaction call. Don't know if it can be done otherwise.
      // TODO if it can
      const transactionCallback = getTransactionCallback();
      await transactionCallback(prismaMock);

      expect(prismaMock.userUrl.create).toHaveBeenCalledWith({
        data: {
          id: ID_PLACEHOLDER_REPLACED_BY_ID_GENERATOR,
          userId: urlQueueItem.userId,
          urlId: urlEntity.id,
        },
      });
    });

    it("url in queue is marked as accepted (no future processing; entity can be deleted by separate job)", async () => {
      const handler = processQueueItemHandlerFactory({ fetchMetadata, logger });
      await handler({ urlQueueId: urlQueueItem.id, requestId });

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
