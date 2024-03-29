import { USER_ID_PREFIX, generateUserId } from "./generate-user-id";

describe("generateUserId", () => {
  it("should prefix id with user prefix", () => {
    const id = generateUserId();

    const pattern = `^${USER_ID_PREFIX}`;
    expect(id).toMatch(new RegExp(pattern));
  });
});
