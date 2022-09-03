import { UrlQueue } from "@prisma/client";
import { sha1 } from "../../../crypto/sha1";
import { generateUrlQueueId } from "../../utils/generateUrlQueueId";

const urlQueue: UrlQueue = {
  id: generateUrlQueueId(),
  createdAt: new Date(),
  updatedAt: new Date(),
  rawUrl: "https://urlshare.me",
  rawUrlHash: sha1("https://urlshare.me"),
  status: "NEW",
  attemptCount: 0,
  metadata: {},
  userId: "usr_userId",
};

export const createUrlQueueItem = (overwrites: Partial<UrlQueue> = {}): UrlQueue => ({
  ...urlQueue,
  ...overwrites,
});