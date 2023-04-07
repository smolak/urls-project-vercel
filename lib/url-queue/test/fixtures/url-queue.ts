import { UrlQueue } from "@prisma/client";
import { sha1 } from "../../../crypto/sha1";
import { generateUrlQueueId } from "../../utils/generate-url-queue-id";
import { generateUserId } from "../../../user/utils/generate-user-id";

const urlQueue: UrlQueue = {
  id: generateUrlQueueId(),
  createdAt: new Date(),
  updatedAt: new Date(),
  rawUrl: "https://urlshare.me",
  rawUrlHash: sha1("https://urlshare.me"),
  status: "NEW",
  attemptCount: 0,
  metadata: {},
  userId: generateUserId(),
};

export const createUrlQueueItem = (overwrites: Partial<UrlQueue> = {}): UrlQueue => ({
  ...urlQueue,
  ...overwrites,
});
