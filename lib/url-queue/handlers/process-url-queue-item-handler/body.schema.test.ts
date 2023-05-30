import { ProcessUrlQueueItemHandlerBodySchema, processUrlQueueItemHandlerBodySchema } from "./body.schema";
import { SafeParseError, ZodError } from "zod";
import { generateUrlQueueId } from "../../utils/generate-url-queue-id";

describe("processUrlQueueItemHandlerBodySchema", () => {
  it('should pass validation for an object containing valid "urlQueueId" property value', () => {
    const urlQueueId = generateUrlQueueId();
    const result = processUrlQueueItemHandlerBodySchema.parse({ urlQueueId });

    expect(result.urlQueueId).toEqual(urlQueueId);
  });

  it('should trim "urlQueueId" upon successful validation', () => {
    const urlQueueId = generateUrlQueueId();
    const idToTrim = `   \n\n\n\t\t\t${urlQueueId}\t\t\t\n\n\n    `;

    const result = processUrlQueueItemHandlerBodySchema.parse({ urlQueueId: idToTrim });

    expect(result.urlQueueId).toEqual(urlQueueId);
  });

  describe('it should not pass validation when passed "urlQueueId"', () => {
    it("is not a string", () => {
      const urlQueueId = 42;

      const { error } = processUrlQueueItemHandlerBodySchema.safeParse({
        urlQueueId,
      }) as SafeParseError<ProcessUrlQueueItemHandlerBodySchema>;

      expect(error).toBeInstanceOf(ZodError);
    });
  });
});
