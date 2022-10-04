import { getToken } from "next-auth/jwt";
import { createUrlHandlerFactory } from "./factory";
import { triggerEvent } from "../../../events-aggregator/triggerEvent";
import { NextApiRequest, NextApiResponse } from "next";
import { Url, UrlQueue } from "@prisma/client";

type UrlAlreadyExists = { url: Url["url"] };
type UrlAddedToQueue = { urlQueueId: UrlQueue["id"] };
type SomethingWentWrong = { error: string };

type ApiResponse = UrlAlreadyExists | UrlAddedToQueue | SomethingWentWrong;

export type CreateUrlHandler = (req: NextApiRequest, res: NextApiResponse<ApiResponse>) => Promise<void>;

export const createUrlHandler: CreateUrlHandler = createUrlHandlerFactory({ getToken, triggerEvent });
