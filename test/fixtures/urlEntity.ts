import { Prisma, Url } from "@prisma/client";
import { sha1 } from "../../lib/crypto/sha1";
import { generateUrlId } from "../../lib/url/utils/generateUrlId";
import { createExampleMetadata } from "./exampleMetadata";

const url = "https://example.url";
const title = "Page title";
const description = "Description";

export const createUrlEntity = (overwrites: Partial<Url> = {}): Url => ({
  id: generateUrlId(),
  createdAt: new Date(),
  updatedAt: new Date(),
  url,
  urlHash: sha1(url),
  title,
  description,
  metadata: createExampleMetadata({ url, title, description }) as Prisma.JsonValue,
  ...overwrites,
});
