import { protectedProcedure } from "../../../../server/api/trpc";
import { TRPCError } from "@trpc/server";
import { CompressedMetadata, decompressMetadata } from "../../../metadata/compression";

export const getUrls = protectedProcedure.query(async ({ ctx: { session, prisma } }) => {
  if (session.user.role !== "ADMIN") {
    throw new TRPCError({
      code: "FORBIDDEN",
    });
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

  return urlList;
});
