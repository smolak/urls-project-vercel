import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { getUrlsHandlerFactory } from "./factory";
import { AdminUrlListVm } from "../../../admin/urls/models/AdminUrlList.vm";

export type GetUrlsHandler = (req: NextApiRequest, res: NextApiResponse<AdminUrlListVm>) => Promise<void>;

export const getUrlsHandler: GetUrlsHandler = getUrlsHandlerFactory({ getToken });
