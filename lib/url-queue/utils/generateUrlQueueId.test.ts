import { URL_QUEUE_ID_PREFIX, generateUrlQueueId } from "./generateUrlQueueId";

describe("generateUrlQueueId", () => {
  it("should prefix id with url queue prefix", () => {
    const id = generateUrlQueueId();

    expect(id).toStartWith(URL_QUEUE_ID_PREFIX);
  });
});
