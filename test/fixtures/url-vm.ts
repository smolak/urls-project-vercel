import { sha1 } from "../../lib/crypto/sha1";
import { generateUrlId } from "../../lib/url/utils/generate-url-id";
import { createExampleWebsiteMetadata } from "./example-metadata";
import { UrlVM } from "../../lib/url/models/url.vm";

const url = "https://example.url";

export const createUrlEntity = (overwrites: Partial<UrlVM> = {}): UrlVM => {
  return {
    id: generateUrlId(),
    createdAt: new Date(),
    updatedAt: new Date(),
    url,
    urlHash: sha1(url),
    metadata: createExampleWebsiteMetadata({ url }),
    ...overwrites,
  };
};
