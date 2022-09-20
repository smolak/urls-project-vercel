import { Mock } from "vitest";
import { EventType, triggerEvent } from "./triggerEvent";
import { ProcessQueueItemEvent } from "../url-queue/handlers/processQueueItemHandler";
import { createUrlQueueItem } from "../url-queue/test/fixtures/urlQueue";

vi.mock("../url-queue/handlers/processQueueItemHandler", () => {
  return {
    processQueueItemHandler: vi.fn(),
  };
});
vi.mock("../../logger", () => {
  return {
    logger: {
      error: vi.fn(),
    },
  };
});

import { processQueueItemHandler } from "../url-queue/handlers/processQueueItemHandler";
import { logger } from "../../logger";

describe("triggerEvent", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("URL_QUEUE_CREATED event type", () => {
    it("should be handled", () => {
      const eventExample: ProcessQueueItemEvent = {
        data: { id: createUrlQueueItem().id },
        type: EventType.URL_QUEUE_CREATED,
      };

      triggerEvent(eventExample);

      expect(processQueueItemHandler).toHaveBeenCalledWith({ id: eventExample.data.id });
    });
  });

  describe("when an error is thrown from any of the event handlers", () => {
    it("should be silent", () => {
      (processQueueItemHandler as Mock).mockImplementation(() => {
        throw new Error("Something went wrong");
      });
      const eventExample: ProcessQueueItemEvent = {
        data: { id: createUrlQueueItem().id },
        type: EventType.URL_QUEUE_CREATED,
      };

      expect(() => triggerEvent(eventExample)).not.toThrow();
    });

    it("should log that fact", () => {
      const error = new Error("Something went wrong");

      (processQueueItemHandler as Mock).mockImplementation(() => {
        throw error;
      });
      const eventExample: ProcessQueueItemEvent = {
        data: { id: createUrlQueueItem().id },
        type: EventType.URL_QUEUE_CREATED,
      };

      triggerEvent(eventExample);

      expect(logger.error).toHaveBeenCalledWith(error);
    });
  });
});