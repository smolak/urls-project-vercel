import { ProcessQueueItemHandlerPayloadSchema, processQueueItemHandlerPayloadSchema } from "./payload.schema";
import { SafeParseError, ZodError } from "zod";
import { generateUrlQueueId } from "../../utils/generateUrlQueueId";

describe("processQueueItemHandlerPayloadSchema", () => {
  it('should pass validation for an object containing valid "urlQueueId" property value', () => {
    const urlQueueId = generateUrlQueueId();
    const result = processQueueItemHandlerPayloadSchema.parse({ urlQueueId });

    expect(result.urlQueueId).toEqual(urlQueueId);
  });

  it('should trim "urlQueueId" upon successful validation', () => {
    const urlQueueId = generateUrlQueueId();
    const idToTrim = `   \n\n\n\t\t\t${urlQueueId}\t\t\t\n\n\n    `;

    const result = processQueueItemHandlerPayloadSchema.parse({ urlQueueId: idToTrim });

    expect(result.urlQueueId).toEqual(urlQueueId);
  });

  describe('it should not pass validation when passed "urlQueueId"', () => {
    it("is not a string", () => {
      const urlQueueId = 42;

      const { error } = processQueueItemHandlerPayloadSchema.safeParse({
        urlQueueId,
      }) as SafeParseError<ProcessQueueItemHandlerPayloadSchema>;

      expect(error).toBeInstanceOf(ZodError);
    });
  });
});
