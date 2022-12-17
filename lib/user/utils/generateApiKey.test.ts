import { generateApiKey } from "./generateApiKey";

describe("generateApiKey", () => {
  it("should have 30 chars length", () => {
    const id = generateApiKey();

    expect(id).toHaveLength(30);
  });
});
