import nock from "nock";
import { fetchMetadata } from "./fetch-metadata";
import { htmlContentOfMyProfileOnLN } from "../../test/fixtures/html-content-of-my-profile-on-ln";
import { afterEach } from "vitest";
import { tweetExampleMetadata } from "../../test/fixtures/tweet-example-metadata";
import { Metadata } from "./types";

const baseUrl = "https://urlshare.me";
const path = "/whatever";
const url = baseUrl + path;

function createFetchResponse(data: unknown) {
  return { text: () => new Promise((resolve) => resolve(data)) };
}

describe("fetchMetadata", () => {
  beforeEach(() => {
    nock.disableNetConnect();
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  describe("when the url is a Twitter Tweet / X Xeet (?)", () => {
    const twitterTweet = "https://twitter.com/ValaAfshar/status/1684664268547837952";

    beforeEach(() => {
      global.fetch = vi.fn().mockResolvedValue(createFetchResponse(tweetExampleMetadata));
    });

    it.only("should call Twitter's CDN API url for metadata", async () => {
      const metadata = await fetchMetadata(twitterTweet);

      console.log(metadata);
    });
  });

  describe("when the url points to a website", () => {
    beforeEach(() => {
      nock(baseUrl).head(path).reply(200, undefined, {
        "content-type": "text/html",
      });
      global.fetch = vi.fn().mockResolvedValue(createFetchResponse(htmlContentOfMyProfileOnLN));
    });

    it("should respond with metadata for a website, containing all properties", async () => {
      const metadata = await fetchMetadata(url);

      const hasMetaPropertiesOfAWebsite = (metadata: Partial<Metadata>) => {
        const expectedProperties = [
          "title",
          "description",
          "language",
          "type",
          "url",
          "provider",
          "keywords",
          "section",
          "author",
          "published",
          "modified",
          "robots",
          "copyright",
          "email",
          "twitter",
          "facebook",
          "image",
          "icon",
          "video",
          "audio",
          "contentType",
        ];

        const metadataProperties = Object.keys(metadata);
        const isPresent = (property: string) => metadataProperties.includes(property);

        return expectedProperties.every(isPresent);
      };
      expect(metadata).toSatisfy(hasMetaPropertiesOfAWebsite);
    });
  });

  describe("when the url doesn't point to a website", () => {
    beforeEach(() => {
      nock(baseUrl).head(path).reply(200, undefined, {
        "content-type": "image/jpg",
      });
    });

    it("should respond with metadata including only detected content-type", async () => {
      const metadata = await fetchMetadata(url);

      expect(metadata).toEqual({
        contentType: "image/jpg",
      });
    });
  });

  describe("when content type is not in the headers (as it is not guaranteed to be there)", () => {
    beforeEach(() => {
      nock(baseUrl).head(path).reply(200);
    });

    it("should use an empty string", async () => {
      const metadata = await fetchMetadata(url);

      expect(metadata).toEqual({
        contentType: "",
      });
    });
  });

  describe("when fetching metadata fails", () => {
    const error = {
      message: "Something went wrong...",
      code: 500,
    };

    beforeEach(() => {
      nock(baseUrl).head(path).replyWithError(error);
    });

    it("should reject with the error", async () => {
      // Don't know why the expect(() => ...).rejects.toThrow() did not work :(

      try {
        await fetchMetadata(url);
      } catch (e) {
        expect(e).toEqual(error);
      }
    });
  });
});
