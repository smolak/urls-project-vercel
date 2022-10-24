import { REQUEST_ID_PREFIX, generateRequestId } from "./generateRequestId";

describe("generateRequestId", () => {
  it("should prefix id with user prefix", () => {
    const id = generateRequestId();

    const pattern = `^${REQUEST_ID_PREFIX}`;
    expect(id).toMatch(new RegExp(pattern));
  });
});
