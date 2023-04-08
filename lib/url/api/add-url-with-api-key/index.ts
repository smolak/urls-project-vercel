import { NextApiRequest, NextApiResponse } from "next";
import { logger } from "../../../../logger";
import { addUrlWithApiKeyFactory } from "./factory";
import { triggerEvent } from "../../../events-aggregator/trigger-event";

type AddUrlWithApiKeySuccessResponse = { success: true };
type AddUrlWithApiKeyFailureResponse = { error: string };
export type AddUrlWithApiKeyResponse = AddUrlWithApiKeySuccessResponse | AddUrlWithApiKeyFailureResponse;

export type AddUrlWithApiKeyHandler = (
  req: NextApiRequest,
  res: NextApiResponse<AddUrlWithApiKeyResponse>
) => Promise<void>;

export const addUrlWithApiKeyHandler: AddUrlWithApiKeyHandler = addUrlWithApiKeyFactory({ logger, triggerEvent });
