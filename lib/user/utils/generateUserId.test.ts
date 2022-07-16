import { USER_ID_PREFIX, generateUserId } from "./generateUserId";

jest.mock("nanoid", () => ({
  customAlphabet: () => jest.fn(),
}));

describe("generateUserId", () => {
  it("should prefix id with user prefix", () => {
    const id = generateUserId();

    expect(id).toStartWith(USER_ID_PREFIX);
  });
});
