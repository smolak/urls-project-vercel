import { FetchMetadata } from "../../fetch-metadata";
import { IncomingHttpHeaders } from "http";
import https from "node:https";
import { Metadata } from "../../types";
import { getMetadata } from "./get-metadata";

export const defaultMetadataFetchAdapter: FetchMetadata = async (url) => {
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
    const response = await fetch(url);
    const htmlContent = await response.text();

    metadata = await getMetadata(url, htmlContent);
  }

  metadata.contentType = contentType;

  return metadata;
};
