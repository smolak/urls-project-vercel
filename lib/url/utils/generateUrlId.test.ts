import { URL_ID_PREFIX, generateUrlId } from "./generateUrlId";

describe("generateUrlId", () => {
  it("should prefix id with url prefix", () => {
    const id = generateUrlId();

    expect(id).toStartWith(URL_ID_PREFIX);
  });
});
