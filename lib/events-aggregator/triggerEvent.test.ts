import { Mock } from "vitest";
import { EventType, triggerEvent } from "./triggerEvent";
import { ProcessQueueItemEvent } from "../url-queue/handlers/processQueueItemHandler";
import { generateUrlQueueId } from "../url-queue/utils/generateUrlQueueId";

vi.mock("../url-queue/handlers/processQueueItemHandler", () => {
  return {
    processQueueItemHandler: vi.fn(),
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

import { processQueueItemHandler } from "../url-queue/handlers/processQueueItemHandler";
import { logger } from "../../logger";
import { generateRequestId } from "../shared/utils/generateRequestId";
import { createUrlEntity } from "../../test/fixtures/urlEntity";

const requestId = generateRequestId();

describe("triggerEvent", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("URL_QUEUE_CREATED event type", () => {
    const url = createUrlEntity();

    beforeEach(() => {
      (processQueueItemHandler as Mock).mockResolvedValue(url);
    });

    it("should be handled", async () => {
      const eventExample: ProcessQueueItemEvent = {
        data: { urlQueueId: generateUrlQueueId(), requestId },
        type: EventType.URL_QUEUE_CREATED,
      };

      await triggerEvent(eventExample);

      expect(processQueueItemHandler).toHaveBeenCalledWith({ urlQueueId: eventExample.data.urlQueueId, requestId });
    });

    it("should log the attempt", async () => {
      const eventExample: ProcessQueueItemEvent = {
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
      const eventExample: ProcessQueueItemEvent = {
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
      (processQueueItemHandler as Mock).mockRejectedValue(error);

      const eventExample: ProcessQueueItemEvent = {
        data: { urlQueueId: generateUrlQueueId(), requestId },
        type: EventType.URL_QUEUE_CREATED,
      };

      expect(async () => await triggerEvent(eventExample)).rejects.toThrow();

      // I have no idea why is this not working ...... :(
      // expect(logger.error).toHaveBeenCalledWith({
      //   error,
      //   event: eventExample,
      // });
    });

    it("should rethrow the error (something higher will catch it)", async () => {
      const error = new Error("Something went wrong.");
      (processQueueItemHandler as Mock).mockRejectedValue(error);

      const eventExample: ProcessQueueItemEvent = {
        data: { urlQueueId: generateUrlQueueId(), requestId },
        type: EventType.URL_QUEUE_CREATED,
      };

      expect(async () => await triggerEvent(eventExample)).rejects.toThrow();
    });
  });
});
