import { vi } from "vitest";
import { Logger } from "pino";
import { mockDeep } from "vitest-mock-extended";

import { generateUrlQueueId } from "../../utils/generateUrlQueueId";
import { createUrlQueueItem } from "../../test/fixtures/urlQueue";
import { prismaMock } from "../../../../test/helpers/prismaSingleton";
import { processQueueItemHandlerFactory } from "./factory";
import { sha1 } from "../../../crypto/sha1";
import { compressMetadata } from "../../../metadata/compression";
import { createExampleWebsiteMetadata } from "../../../../test/fixtures/exampleMetadata";
import { createUrlEntity } from "../../../../test/fixtures/urlEntity";
import { ID_PLACEHOLDER_REPLACED_BY_ID_GENERATOR } from "../../../../prisma/middlewares/generateModelId";
import { generateRequestId } from "../../../shared/utils/generateRequestId";

const fetchMetadata = vi.fn();
const logger = mockDeep<Logger>();
const requestId = generateRequestId();

describe("processQueueItemHandler", () => {
  beforeEach(() => {
    vi.resetAllMocks();

    prismaMock.urlQueue.findFirstOrThrow.mockResolvedValue(createUrlQueueItem());
    fetchMetadata.mockResolvedValue(createExampleWebsiteMetadata());
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
          metadata: compressMetadata(exampleMetadata),
        },
      };

      expect(prismaMock.url.create).toHaveBeenCalledWith(expectedPayload);
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

  describe("error handling - when any part of the implementation throws", () => {
    it("should rethrow the error, ", async () => {
      // trigger any type of error that might occur in the handler
      const error = new Error("Item not found.");
      prismaMock.urlQueue.findFirstOrThrow.mockRejectedValue(error);

      const handler = processQueueItemHandlerFactory({ fetchMetadata, logger });

      expect(async () => await handler({ urlQueueId: generateUrlQueueId(), requestId })).rejects.toThrow(error);
    });
  });
});
