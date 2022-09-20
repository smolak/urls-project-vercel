import { URL_ID_PREFIX, generateUrlId } from "./generateUrlId";

describe("generateUrlId", () => {
  it("should prefix id with url prefix", () => {
    const id = generateUrlId();

    const pattern = `^${URL_ID_PREFIX}`;
    expect(id).toMatch(new RegExp(pattern));
  });
});
