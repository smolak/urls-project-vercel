import { getToken } from "next-auth/jwt";
import { createUrlHandlerFactory } from "./factory";
import { triggerEvent } from "../../../events-aggregator/triggerEvent";
import { NextApiRequest, NextApiResponse } from "next";

export type CreateUrlHandler = (req: NextApiRequest, res: NextApiResponse) => Promise<void>;

export const createUrlHandler: CreateUrlHandler = createUrlHandlerFactory({ getToken, triggerEvent });
