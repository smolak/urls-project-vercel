import { sha1 } from "./sha1";

describe("sha1 (regression / verification)", () => {
  it("should create correct sha1 hash signatures", () => {
    // Generated using online generator
    const data = [
      { string: "foo", hash: "0beec7b5ea3f0fdbc95d0dd47f3c5bc275da8a33" },
      { string: "Lorem Ipsum 1234567890-=+", hash: "f29bd228b22814a5f1dd8b2be8a41ed7c53457fa" },
      { string: "https://www.something.com", hash: "5ebb16a1766f1106ea5f53702df4d023ac9d2d7b" },
    ];

    data.forEach(({ string, hash }) => {
      expect(sha1(string)).toEqual(hash);
    });
  });
});
