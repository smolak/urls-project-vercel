import { Url } from "@prisma/client";
import { Metadata } from "../../metadata/getMetadata";

export interface UrlVM extends Omit<Url, "metadata"> {
  metadata: Metadata;
}
