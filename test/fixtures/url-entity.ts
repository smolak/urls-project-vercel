import { Prisma, Url } from "@prisma/client";
import { sha1 } from "../../lib/crypto/sha1";
import { generateUrlId } from "../../lib/url/utils/generate-url-id";
import { createExampleWebsiteMetadata } from "./example-metadata";
import { compressMetadata } from "../../lib/metadata/compression";

const url = "https://example.url";

export const createUrlEntity = (overwrites: Partial<Url> = {}): Url => ({
  id: generateUrlId(),
  createdAt: new Date(),
  updatedAt: new Date(),
  url,
  urlHash: sha1(url),
  metadata: compressMetadata(createExampleWebsiteMetadata({ url })) as Prisma.JsonValue,
  ...overwrites,
});
