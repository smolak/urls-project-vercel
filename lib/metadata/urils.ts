import { Metadata } from "./get-metadata";

export const isImage = (metadata: Metadata) => metadata.contentType?.startsWith("image");
export const isWebsite = (metadata: Metadata) => metadata.contentType?.includes("html");
