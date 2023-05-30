import { Mock } from "vitest";
import { EventType, triggerEvent } from "./trigger-event";
import { ProcessUrlQueueItemEvent } from "../url-queue/handlers/process-url-queue-item-handler";
import { generateUrlQueueId } from "../url-queue/utils/generate-url-queue-id";
import { logger } from "../../logger";
import { generateRequestId } from "../request-id/utils/generate-request-id";
import { createUrlEntity } from "../../test/fixtures/url-entity";
import { processUrlQueueItem } from "../url-queue/handlers/process-url-queue-item-handler/process-url-queue-item";
import { fetchMetadata } from "../metadata/fetch-metadata";

vi.mock("../url-queue/handlers/process-url-queue-item-handler/process-url-queue-item", () => {
  return {
    processUrlQueueItem: vi.fn(),
  };
});
vi.mock("../../logger", () => {
  return {
    logger: {
      error: vi.fn(),
      info: vi.fn(),
    },
  };
});
vi.mock("../metadata/fetch-metadata", () => {
  return {
    fetchMetadata: vi.fn(),
  };
});

const requestId = generateRequestId();

describe("triggerEvent", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("URL_QUEUE_CREATED event type", () => {
    const url = createUrlEntity();

    beforeEach(() => {
      (processUrlQueueItem as Mock).mockResolvedValue(url);
    });

    it("should be handled", async () => {
      const eventExample: ProcessUrlQueueItemEvent = {
        data: { urlQueueId: generateUrlQueueId(), requestId },
        type: EventType.URL_QUEUE_CREATED,
      };

      await triggerEvent(eventExample);

      expect(processUrlQueueItem).toHaveBeenCalledWith({
        urlQueueId: eventExample.data.urlQueueId,
        requestId,
        fetchMetadata,
        logger,
      });
    });

    it("should log the attempt", async () => {
      const eventExample: ProcessUrlQueueItemEvent = {
        data: { urlQueueId: generateUrlQueueId(), requestId },
        type: EventType.URL_QUEUE_CREATED,
      };

      await triggerEvent(eventExample);

      expect(logger.info).toHaveBeenCalledWith(
        {
          requestId,
          event: eventExample.type,
        },
        `Event ${eventExample.type} triggered.`
      );
    });

    it("should resolve with value coming from event handler", async () => {
      const eventExample: ProcessUrlQueueItemEvent = {
        data: { urlQueueId: generateUrlQueueId(), requestId },
        type: EventType.URL_QUEUE_CREATED,
      };

      const value = await triggerEvent(eventExample);

      expect(value).toEqual(url);
    });
  });

  describe("when an error is thrown from any of the event handlers", () => {
    it("should log that fact", async () => {
      const error = new Error("Something went wrong.");
      (processUrlQueueItem as Mock).mockRejectedValue(error);

      const eventExample: ProcessUrlQueueItemEvent = {
        data: { urlQueueId: generateUrlQueueId(), requestId },
        type: EventType.URL_QUEUE_CREATED,
      };

      expect(async () => await triggerEvent(eventExample))
        .rejects.toThrow()
        .then(() => {
          expect(logger.error).toHaveBeenCalledWith({
            error,
            event: eventExample,
          });
        });
    });

    it("should rethrow the error (something higher will catch it)", async () => {
      const error = new Error("Something went wrong.");
      (processUrlQueueItem as Mock).mockRejectedValue(error);

      const eventExample: ProcessUrlQueueItemEvent = {
        data: { urlQueueId: generateUrlQueueId(), requestId },
        type: EventType.URL_QUEUE_CREATED,
      };

      expect(async () => await triggerEvent(eventExample)).rejects.toThrow();
    });
  });
});
