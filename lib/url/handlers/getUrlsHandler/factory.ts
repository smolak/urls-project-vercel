import prisma from "../../../../prisma";
import { CompressedMetadata, decompressMetadata } from "../../../metadata/compression";
import { StatusCodes } from "http-status-codes";
import { GetUrlsHandler } from "./index";
import { GetToken } from "../../../auth/models/GetToken";

interface Params {
  getToken: GetToken;
}

type GetUrlsHandlerFactory = ({ getToken }: Params) => GetUrlsHandler;

export const getUrlsHandlerFactory: GetUrlsHandlerFactory =
  ({ getToken }) =>
  async (req, res) => {
    const token = await getToken({ req });

    if (!token || token?.role !== "ADMIN") {
      res.status(StatusCodes.FORBIDDEN);
      return;
    }

    const userUrls = await prisma.userUrl.findMany({
      include: {
        url: true,
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            createdAt: true,
          },
        },
      },
    });

    const urlList = userUrls.map(({ url, user, ...userUrl }) => {
      return {
        user,
        userUrl,
        url: {
          ...url,
          metadata: decompressMetadata(url.metadata as CompressedMetadata),
        },
      };
    });

    res.status(200);
    res.json(urlList);
  };
