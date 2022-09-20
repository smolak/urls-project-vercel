import { ProcessQueueItemHandlerPayload, processQueueItemHandlerPayloadSchema } from "./payload";
import { SafeParseError, ZodError } from "zod";

describe("processQueueItemHandlerPayloadSchema", () => {
  it('should pass validation for an object containing valid "id" property value', () => {
    const id = "string-like-id";
    const result = processQueueItemHandlerPayloadSchema.parse({ id });

    expect(result.id).toEqual(id);
  });

  it('should trim "id" upon successful validation', () => {
    const id = "string-like-id";
    const idToTrim = `   \n\n\n\t\t\t${id}\t\t\t\n\n\n    `;

    const result = processQueueItemHandlerPayloadSchema.parse({ id: idToTrim });

    expect(result.id).toEqual(id);
  });

  describe('it should not pass validation when passed "id"', () => {
    it("is not a string", () => {
      const id = 42;

      const { error } = processQueueItemHandlerPayloadSchema.safeParse({
        id,
      }) as SafeParseError<ProcessQueueItemHandlerPayload>;

      expect(error).toBeInstanceOf(ZodError);
    });
  });
});
