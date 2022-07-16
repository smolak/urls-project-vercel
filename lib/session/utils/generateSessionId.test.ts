import { SESSION_ID_PREFIX, generateSessionId } from "./generateSessionId";

jest.mock("nanoid", () => ({
  customAlphabet: () => jest.fn(),
}));

describe("generateSessionId", () => {
  it("should prefix id with session prefix", () => {
    const id = generateSessionId();

    expect(id).toStartWith(SESSION_ID_PREFIX);
  });
});
