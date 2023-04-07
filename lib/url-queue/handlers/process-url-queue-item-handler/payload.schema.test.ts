import { ProcessUrlQueueItemHandlerPayloadSchema, processUrlQueueItemHandlerPayloadSchema } from "./payload.schema";
import { SafeParseError, ZodError } from "zod";
import { generateUrlQueueId } from "../../utils/generate-url-queue-id";

describe("processQueueItemHandlerPayloadSchema", () => {
  it('should pass validation for an object containing valid "urlQueueId" property value', () => {
    const urlQueueId = generateUrlQueueId();
    const result = processUrlQueueItemHandlerPayloadSchema.parse({ urlQueueId });

    expect(result.urlQueueId).toEqual(urlQueueId);
  });

  it('should trim "urlQueueId" upon successful validation', () => {
    const urlQueueId = generateUrlQueueId();
    const idToTrim = `   \n\n\n\t\t\t${urlQueueId}\t\t\t\n\n\n    `;

    const result = processUrlQueueItemHandlerPayloadSchema.parse({ urlQueueId: idToTrim });

    expect(result.urlQueueId).toEqual(urlQueueId);
  });

  describe('it should not pass validation when passed "urlQueueId"', () => {
    it("is not a string", () => {
      const urlQueueId = 42;

      const { error } = processUrlQueueItemHandlerPayloadSchema.safeParse({
        urlQueueId,
      }) as SafeParseError<ProcessUrlQueueItemHandlerPayloadSchema>;

      expect(error).toBeInstanceOf(ZodError);
    });
  });
});
