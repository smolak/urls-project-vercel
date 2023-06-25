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
      userProfileData: {
        select: {
          id: true,
          image: true,
          username: true,
          createdAt: true,
        },
      },
    },
  });

  const urlList = userUrls.map(({ url, userProfileData, ...userUrl }) => {
    return {
      userProfileData,
      userUrl,
      url: {
        ...url,
        metadata: decompressMetadata(url.metadata as CompressedMetadata),
      },
    };
  });

  return urlList;
});
