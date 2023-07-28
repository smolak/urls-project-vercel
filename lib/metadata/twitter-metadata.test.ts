import { afterEach, expect } from "vitest";
import { getTweetId, getTweetMetadata, isTweetUrl, toMetadata } from "./twitter-metadata";
import nock from "nock";
import { tweetExampleMetadata } from "../../test/fixtures/tweet-example-metadata";
import { tweetMetadataSchema } from "./tweet-metadata.schema";

describe("isTweetUrl", () => {
  it("determines if a url is for a Tweet from Twitter (or X)", () => {
    const urls = Object.values({
      tweetUrl: {
        url: "https://twitter.com/jacek_smolak/status/1634983564881305602",
        expectedResult: true,
      },
      twitterUserProfileUrl: {
        url: "https://twitter.com/jacek_smolak",
        expectedResult: false,
      },
      notTwitterAtAll: {
        url: "https://urlshare.me",
        expectedResult: false,
      },
    });

    urls.forEach(({ url, expectedResult }) => {
      expect(isTweetUrl(url)).toEqual(expectedResult);
    });
  });
});

describe("getTweetId", () => {
  it("extracts tweet id from the tweet url", () => {
    const tweetUrl = "https://twitter.com/jacek_smolak/status/1634983564881305602";

    const tweetId = getTweetId(tweetUrl);

    expect(tweetId).toEqual("1634983564881305602");
  });
});

describe("getTweetMetadata", () => {
  beforeEach(() => {
    nock.disableNetConnect();
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it("fetches the metadata from Twitters CDN and transforms it to metadata object", async () => {
    const tweetUrl = "https://twitter.com/AiBreakfast/status/1684020175215927296";
    const tweetId = getTweetId(tweetUrl);
    const expectedMetadata = toMetadata(tweetUrl, tweetMetadataSchema.parse(tweetExampleMetadata));

    nock("https://cdn.syndication.twimg.com")
      .get("/tweet-result")
      .query({ id: tweetId })
      .reply(200, tweetExampleMetadata);

    const result = await getTweetMetadata(tweetUrl);

    expect(result).toEqual(expectedMetadata);
  });
});