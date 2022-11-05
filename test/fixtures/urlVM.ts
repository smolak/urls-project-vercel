import { sha1 } from "../../lib/crypto/sha1";
import { generateUrlId } from "../../lib/url/utils/generateUrlId";
import { createExampleWebsiteMetadata } from "./exampleMetadata";
import { UrlVM } from "../../lib/url/models/Url.vm";

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
