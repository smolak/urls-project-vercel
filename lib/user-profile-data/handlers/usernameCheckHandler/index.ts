import { NextApiRequest, NextApiResponse } from "next";
import { usernameCheckHandlerFactory } from "./factory";
import { getToken } from "next-auth/jwt";
import { logger } from "../../../../logger";

export interface UsernameCheckResponse {
  usernameAvailable: boolean;
}

export type UsernameCheckHandler = (req: NextApiRequest, res: NextApiResponse<UsernameCheckResponse>) => Promise<void>;

export const usernameCheckHandler: UsernameCheckHandler = usernameCheckHandlerFactory({ getToken, logger });
