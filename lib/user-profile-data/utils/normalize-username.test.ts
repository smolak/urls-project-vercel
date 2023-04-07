import { normalizeUsername } from "./normalize-username";
import { expect } from "vitest";

describe("normalizeUsername", () => {
  it("should lowercase passed username", () => {
    const usernames = [
      { input: "jacek", output: "jacek" },
      { input: "JACEK", output: "jacek" },
      { input: "Jacek", output: "jacek" },
      { input: "JaCeK", output: "jacek" },
      { input: "jaCek", output: "jacek" },
    ];

    usernames.forEach(({ input, output }) => {
      expect(normalizeUsername(input)).toEqual(output);
    });
  });
});
