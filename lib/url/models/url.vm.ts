import { Url } from "@prisma/client";

import { Metadata } from "../../metadata/types";

export interface UrlVM extends Omit<Url, "metadata"> {
  metadata: Metadata;
}
