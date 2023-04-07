import { Url } from "@prisma/client";
import { Metadata } from "../../metadata/get-metadata";

export interface UrlVM extends Omit<Url, "metadata"> {
  metadata: Metadata;
}
