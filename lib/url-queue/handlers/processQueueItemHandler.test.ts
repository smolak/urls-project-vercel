import { generateUrlQueueId } from "../utils/generateUrlQueueId";
import { createUrlQueueItem } from "../test/fixtures/urlQueue";
import { prismaMock } from "../../../test/helpers/prismaSingleton";
import { processQueueItemHandler } from "./processQueueItemHandler";
import { getMetadataMock } from "../../../test/helpers/getMetadataSingleton";
import { sha1 } from "../../crypto/sha1";
import { compressMetadata } from "../../metadata/compression";
import { createExampleMetadata } from "../../../test/fixtures/exampleMetadata";
import { createUrlEntity } from "../../../test/fixtures/urlEntity";
import axios from "axios";

jest.mock("../../metadata/getMetadata");
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const urlQueueItemId = generateUrlQueueId();

describe("processQueueItemHandler", () => {
  beforeEach(() => {
    prismaMock.urlQueue.findFirstOrThrow.mockResolvedValue(createUrlQueueItem());
  });

  describe("when url queue item is not to be found", () => {
    it("should not throw, handler is silent", async () => {
      // trigger any type of error that might occur in the handler
      prismaMock.urlQueue.findFirstOrThrow.mockRejectedValue(new Error("Item not found"));

      expect(async () => await processQueueItemHandler("url_queue_itemId")).not.toThrow();
    });

    it("should error log that fact", async () => {
      // trigger any type of error that might occur in the handler
      const error = new Error("Item not found");
      prismaMock.urlQueue.findFirstOrThrow.mockRejectedValue(error);

      await processQueueItemHandler("url_queue_itemId");

      expect(console.error).toHaveBeenCalledWith(error);
    });
  });

  it("should look for item in queue, but only for one in processable status", async () => {
    await processQueueItemHandler(urlQueueItemId);

    expect(prismaMock.urlQueue.findFirstOrThrow).toHaveBeenCalledWith({
      where: {
        id: urlQueueItemId,
        status: {
          in: ["NEW", "FAILED"],
        },
      },
    });
  });

  it("found item gets updated in terms of attempt count", async () => {
    const urlQueueItem = createUrlQueueItem();
    prismaMock.urlQueue.findFirstOrThrow.mockResolvedValue(urlQueueItem);

    await processQueueItemHandler(urlQueueItem.id);

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

      await processQueueItemHandler(urlQueueItem.id);

      expect(mockedAxios.head).toHaveBeenCalledWith(urlQueueItem.rawUrl);
    });

    describe("when a website is detected", () => {
      beforeEach(() => {
        mockedAxios.head.mockResolvedValue({
          "content-type": "text/html; charset=utf-8",
          // whatever else can be here, doesn't matter
        });
      });

      it("should fetch this website's metadata", async () => {
        const urlQueueItem = createUrlQueueItem();

        await processQueueItemHandler(urlQueueItem.id);

        expect(getMetadataMock).toHaveBeenCalledWith(urlQueueItem.rawUrl);
      });
    });

    describe("when anything other than a website is detected", () => {
      beforeEach(() => {
        mockedAxios.head.mockResolvedValue({
          "content-type": "image/png",
          // whatever else can be here, doesn't matter
        });
      });

      it("should not obtain the metadata (as there is nothing to obtain it from)", async () => {
        const urlQueueItem = createUrlQueueItem();

        await processQueueItemHandler(urlQueueItem.id);

        expect(getMetadataMock).not.toHaveBeenCalled();
      });
    });
  });

  describe("this is wrapped in transaction, either all succeed or none", () => {
    const urlEntity = createUrlEntity();
    const urlQueueItem = createUrlQueueItem();
    const exampleMetadata = createExampleMetadata({ contentType: undefined });
    const websiteContentType = "text/html; charset=utf-8";

    beforeEach(() => {
      // This is a Jest's mock implementation. Don't know wny TS doesn't know it.
      // TODO fix it
      // @ts-ignore
      getMetadataMock.mockResolvedValue(exampleMetadata);

      // Make sure website is detected so that metadata can be fetched
      mockedAxios.head.mockResolvedValue({
        "content-type": websiteContentType,
        // whatever else can be here, doesn't matter
      });

      prismaMock.urlQueue.findFirstOrThrow.mockResolvedValue(urlQueueItem);
      prismaMock.url.create.mockResolvedValue(urlEntity);
    });

    it("Url entity is created", async () => {
      await processQueueItemHandler(urlQueueItem.id);

      expect(prismaMock.$transaction).toHaveBeenCalled();

      // Triggering $transaction call. Don't know if it can be done otherwise.
      // TODO if it can
      const transactionCallback = prismaMock.$transaction.mock.calls[0][0];
      await transactionCallback(prismaMock);

      const expectedPayload = {
        data: {
          id: "will-be-created-by-middleware",
          url: exampleMetadata.url,
          urlHash: sha1(exampleMetadata.url as string),
          title: exampleMetadata.title,
          description: exampleMetadata.description,
          metadata: compressMetadata({ ...exampleMetadata, contentType: "text/html; charset=utf-8" }),
        },
      };

      expect(prismaMock.url.create).toHaveBeenCalledWith(expectedPayload);
    });

    describe("when the URL does not point to a website (that would have metadata, e.g. title, description)", () => {
      beforeEach(() => {
        mockedAxios.head.mockResolvedValue({
          "content-type": "image/png",
          // whatever else can be here, doesn't matter
        });
      });

      it("should not fetch metadata and use default values in such case", async () => {
        await processQueueItemHandler(urlQueueItem.id);

        expect(prismaMock.$transaction).toHaveBeenCalled();

        // Triggering $transaction call. Don't know if it can be done otherwise.
        // TODO if it can
        const transactionCallback = prismaMock.$transaction.mock.calls[0][0];
        await transactionCallback(prismaMock);

        const expectedPayload = {
          data: {
            id: "will-be-created-by-middleware",
            url: urlQueueItem.rawUrl,
            urlHash: sha1(urlQueueItem.rawUrl),
            title: "",
            description: "",
            metadata: compressMetadata({ contentType: "image/png" }),
          },
        };

        expect(prismaMock.url.create).toHaveBeenCalledWith(expectedPayload);
        expect(getMetadataMock).not.toHaveBeenCalled();
      });
    });

    it("relationship between created url and user that added it is created", async () => {
      await processQueueItemHandler(urlQueueItem.id);

      expect(prismaMock.$transaction).toHaveBeenCalled();

      // Triggering $transaction call. Don't know if it can be done otherwise.
      // TODO if it can
      const transactionCallback = prismaMock.$transaction.mock.calls[0][0];
      await transactionCallback(prismaMock);

      expect(prismaMock.userUrl.create).toHaveBeenCalledWith({
        data: {
          userId: urlQueueItem.userId,
          urlId: urlEntity.id,
        },
      });
    });

    it("url in queue is marked as accepted (no future processing, could be deleted by separate cron job)", async () => {
      await processQueueItemHandler(urlQueueItem.id);

      expect(prismaMock.$transaction).toHaveBeenCalled();

      // Triggering $transaction call. Don't know if it can be done otherwise.
      // TODO if it can
      const transactionCallback = prismaMock.$transaction.mock.calls[0][0];
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
