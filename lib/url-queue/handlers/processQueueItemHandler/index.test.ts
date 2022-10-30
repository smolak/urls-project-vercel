import { vi } from "vitest";

const handler = vi.fn();

vi.mock("./factory", () => {
  return {
    processQueueItemHandlerFactory: vi.fn().mockReturnValue(handler),
  };
});

import { processQueueItemHandlerFactory } from "./factory";
import { processQueueItemHandler } from "./index";
import { fetchMetadata } from "../../../metadata/fetchMetadata";
import { logger } from "../../../../logger";

describe("processQueueItemHandler", () => {
  it("is create when imported", () => {
    expect(processQueueItemHandlerFactory).toHaveBeenCalledWith({ fetchMetadata, logger });
    expect(processQueueItemHandler).toEqual(handler);
  });
});
