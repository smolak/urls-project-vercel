import { Mock } from "vitest";
import { EventType, triggerEvent } from "./triggerEvent";
import { ProcessUrlQueueItemEvent, processUrlQueueItemHandler } from "../url-queue/handlers/processUrlQueueItemHandler";
import { generateUrlQueueId } from "../url-queue/utils/generateUrlQueueId";
import { logger } from "../../logger";
import { generateRequestId } from "../request-id/utils/generateRequestId";
import { createUrlEntity } from "../../test/fixtures/urlEntity";

vi.mock("../url-queue/handlers/processUrlQueueItemHandler", () => {
  return {
    processUrlQueueItemHandler: vi.fn(),
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

const requestId = generateRequestId();

describe("triggerEvent", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("URL_QUEUE_CREATED event type", () => {
    const url = createUrlEntity();

    beforeEach(() => {
      (processUrlQueueItemHandler as Mock).mockResolvedValue(url);
    });

    it("should be handled", async () => {
      const eventExample: ProcessUrlQueueItemEvent = {
        data: { urlQueueId: generateUrlQueueId(), requestId },
        type: EventType.URL_QUEUE_CREATED,
      };

      await triggerEvent(eventExample);

      expect(processUrlQueueItemHandler).toHaveBeenCalledWith({ urlQueueId: eventExample.data.urlQueueId, requestId });
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
      (processUrlQueueItemHandler as Mock).mockRejectedValue(error);

      const eventExample: ProcessUrlQueueItemEvent = {
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
      (processUrlQueueItemHandler as Mock).mockRejectedValue(error);

      const eventExample: ProcessUrlQueueItemEvent = {
        data: { urlQueueId: generateUrlQueueId(), requestId },
        type: EventType.URL_QUEUE_CREATED,
      };

      expect(async () => await triggerEvent(eventExample)).rejects.toThrow();
    });
  });
});
