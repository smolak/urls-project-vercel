import { FEED_QUEUE_ID_PREFIX, generateFeedQueueId } from "./generateFeedQueueId";

describe("generateFeedQueueId", () => {
  it("should prefix id with feed queue prefix", () => {
    const id = generateFeedQueueId();

    const pattern = `^${FEED_QUEUE_ID_PREFIX}`;
    expect(id).toMatch(new RegExp(pattern));
  });
});
