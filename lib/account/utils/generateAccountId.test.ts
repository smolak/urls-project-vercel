import { ACCOUNT_ID_PREFIX, generateAccountId } from "./generateAccountId";

describe("generateAccountId", () => {
  it("should prefix id with account prefix", () => {
    const id = generateAccountId();

    expect(id).toStartWith(ACCOUNT_ID_PREFIX);
  });
});
