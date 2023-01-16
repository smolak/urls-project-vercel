import { vi } from "vitest";

const handler = vi.fn();

vi.mock("./factory", () => {
  return {
    processUrlQueueItemHandlerFactory: vi.fn().mockReturnValue(handler),
  };
});

import { processUrlQueueItemHandlerFactory } from "./factory";
import { processUrlQueueItemHandler } from "./index";
import { fetchMetadata } from "../../../metadata/fetchMetadata";
import { logger } from "../../../../logger";

describe("processUrlQueueItemHandler", () => {
  it("is create when imported", () => {
    expect(processUrlQueueItemHandlerFactory).toHaveBeenCalledWith({ fetchMetadata, logger });
    expect(processUrlQueueItemHandler).toEqual(handler);
  });
});
