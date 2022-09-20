import { Prisma, UrlQueue } from "@prisma/client";
import { sha1 } from "../../lib/crypto/sha1";
import { generateUrlId } from "../../lib/url/utils/generateUrlId";
import { generateUrlQueueId } from "../../lib/url-queue/utils/generateUrlQueueId";

const url = "https://example.url";

export const createUrlQueue = (overwrites: Partial<UrlQueue> = {}): UrlQueue => ({
  id: generateUrlId(),
  createdAt: new Date(),
  updatedAt: new Date(),
  rawUrl: url,
  rawUrlHash: sha1(url),
  status: "NEW",
  attemptCount: 0,
  metadata: {} as Prisma.JsonValue,
  userId: generateUrlQueueId(),
  ...overwrites,
});
