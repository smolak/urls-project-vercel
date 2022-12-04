import { usernameCheckHandlerPayloadSchema, UsernameCheckHandlerPayload } from "./payload";
import { expect } from "vitest";
import { SafeParseError, SafeParseSuccess } from "zod";

describe("usernameCheckHandlerPayloadSchema", () => {
  it("should allow to use _azAZ09 characters only", () => {
    const validUsernames = ["Jacek", "_Jacek", "Jacek_", "Jacek123", "J_a_c_e_k", "__Jacek__", "123_jacek__"];

    validUsernames.forEach((username) => {
      expect(() => usernameCheckHandlerPayloadSchema.parse({ username })).not.toThrow();
    });

    const invalidUsernames = ["with spaces", "nonAZchars_ęóą", "badChars_!@#$%^"];

    invalidUsernames.forEach((username) => {
      const result = usernameCheckHandlerPayloadSchema.safeParse({
        username,
      }) as SafeParseError<UsernameCheckHandlerPayload>;

      expect(result.success).toEqual(false);
      expect(result.error.format().username?._errors).toContain("Only a-z, A-Z, 0-9 and _ characters allowed.");
    });
  });

  it("should allow for min 4 and max 15 character long values", () => {
    const minLength = 4;
    const maxLength = 15;

    const usernamesWithinLengthLimit = ["a".repeat(minLength), "a".repeat(maxLength)];
    const usernamesOutsideOfLengthLimit = ["a".repeat(minLength - 1), "a".repeat(maxLength + 1)];

    usernamesWithinLengthLimit.forEach((username) => {
      expect(() => usernameCheckHandlerPayloadSchema.parse({ username })).not.toThrow();
    });

    usernamesOutsideOfLengthLimit.forEach((username) => {
      const result = usernameCheckHandlerPayloadSchema.safeParse({
        username,
      }) as SafeParseError<UsernameCheckHandlerPayload>;

      expect(result.success).toEqual(false);
      expect(result.error.format().username?._errors).toContain(
        "Username cannot be shorter than 4 and longer than 15 characters."
      );
    });
  });

  it("should trim entered string", () => {
    const username = "Jacek";
    const stringsWithSpacesAroundThem = [
      ` ${username}`,
      `${username} `,
      ` ${username} `,
      `   ${username}   `,
      `\n\t   ${username}   \t\n`,
    ];

    stringsWithSpacesAroundThem.forEach((usernameWithSpaces) => {
      const result = usernameCheckHandlerPayloadSchema.safeParse({
        username: usernameWithSpaces,
      }) as SafeParseSuccess<UsernameCheckHandlerPayload>;

      expect(result.data.username).toEqual(username);
    });
  });
});
