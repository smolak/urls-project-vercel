import { FetchMetadata } from "../../fetch-metadata";
import { Metadata } from "../../types";
import { getMetadata } from "./get-metadata";
import axios from "axios";

export const defaultMetadataFetchAdapter: FetchMetadata = async (url) => {
  const { headers } = await axios.head(url);
  const contentType = headers["content-type"] || "";
  const isAWebsite = contentType.includes("text/html");

  let metadata: Metadata = {};

  if (isAWebsite) {
    const { data: htmlContent } = await axios.get(url);

    metadata = await getMetadata(url, htmlContent);
  }

  metadata.contentType = contentType;

  return metadata;
};
