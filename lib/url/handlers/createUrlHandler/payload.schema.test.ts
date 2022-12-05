import { CreateUrlHandlerPayloadSchema, createUrlHandlerPayloadSchema } from "./payload.schema";
import { ZodError, SafeParseError } from "zod";

describe("createUrlHandlerPayloadSchema", () => {
  it('should pass validation for an object containing valid "url" property value', () => {
    const url = "https://example.com";
    const result = createUrlHandlerPayloadSchema.parse({ url });

    expect(result.url).toEqual(url);
  });

  it('should trim "url" upon successful validation', () => {
    const url = "https://example.com";
    const urlToTrim = `   \n\n\n\t\t\t${url}\t\t\t\n\n\n    `;
    const result = createUrlHandlerPayloadSchema.parse({ url: urlToTrim });

    expect(result.url).toEqual(url);
  });

  describe('it should not pass validation when passed "url"', () => {
    it("is not a string", () => {
      const notAString = 42;

      const { error } = createUrlHandlerPayloadSchema.safeParse({
        url: notAString,
      }) as SafeParseError<CreateUrlHandlerPayloadSchema>;

      expect(error).toBeInstanceOf(ZodError);
    });

    it("is not a valid url", () => {
      const notAUrl = "Hello, World!";

      const { error } = createUrlHandlerPayloadSchema.safeParse({
        url: notAUrl,
      }) as SafeParseError<CreateUrlHandlerPayloadSchema>;

      expect(error).toBeInstanceOf(ZodError);
    });

    it("does not start with https", () => {
      const notWantedUrl = "ws://example.com";

      const { error } = createUrlHandlerPayloadSchema.safeParse({
        url: notWantedUrl,
      }) as SafeParseError<CreateUrlHandlerPayloadSchema>;

      expect(error).toBeInstanceOf(ZodError);

      const errorMessage = error.format().url?._errors[0];
      expect(errorMessage).toEqual("Only https:// URLs allowed at the moment. Passed URL: ws://example.com");
    });

    it("is too long", () => {
      const tooLongUrl = `https://${"a".repeat(489)}.com`;

      const { error } = createUrlHandlerPayloadSchema.safeParse({
        url: tooLongUrl,
      }) as SafeParseError<CreateUrlHandlerPayloadSchema>;

      expect(error).toBeInstanceOf(ZodError);

      const errorMessage = error.format().url?._errors[0];
      expect(errorMessage).toEqual("Oh NOES! That URL is too long. Detected 501 characters and max 500 is allowed.");
    });
  });
});
