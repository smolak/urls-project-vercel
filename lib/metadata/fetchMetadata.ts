import { getMetadata, Metadata } from "./getMetadata";
import { IncomingHttpHeaders } from "http";
import https from "node:https";

export type FetchMetadata = (url: string) => Promise<Metadata>;

export const fetchMetadata: FetchMetadata = async (url) => {
  const result = await new Promise<IncomingHttpHeaders>((resolve, reject) => {
    https
      .request(url, { method: "HEAD" })
      .on("response", (data) => {
        resolve(data.headers);
      })
      .on("error", (error) => {
        reject(error);
      })
      .end();
  });

  const contentType = result["content-type"] || "";
  const isAWebsite = contentType.includes("text/html");

  let metadata: Metadata = {};

  if (isAWebsite) {
    metadata = await getMetadata(url);
  }

  metadata.contentType = contentType;

  return metadata;
};
