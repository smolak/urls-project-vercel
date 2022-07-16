import { ACCOUNT_ID_PREFIX, generateAccountId } from "./generateAccountId";

jest.mock("nanoid", () => ({
  customAlphabet: () => jest.fn(),
}));

describe("generateAccountId", () => {
  it("should prefix id with account prefix", () => {
    const id = generateAccountId();

    expect(id).toStartWith(ACCOUNT_ID_PREFIX);
  });
});
