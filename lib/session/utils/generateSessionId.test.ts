import { SESSION_ID_PREFIX, generateSessionId } from "./generateSessionId";

describe("generateSessionId", () => {
  it("should prefix id with session prefix", () => {
    const id = generateSessionId();

    expect(id).toStartWith(SESSION_ID_PREFIX);
  });
});
