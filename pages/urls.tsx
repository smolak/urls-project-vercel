import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from "next";
import prisma from "../prisma";
import { decompressMetadata } from "../lib/metadata/compression";
import { FeedListItem } from "../lib/feed/ui/FeedListItem";
import { FeedList } from "../lib/feed/ui/FeedList";

const UrlsPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ userUrls }) => {
  return (
    <div>
      <FeedList items={userUrls} />
    </div>
  );
};

export default UrlsPage;

interface UrlsProps {
  userUrls: ReadonlyArray<FeedListItem>;
}

export const getServerSideProps: GetServerSideProps<UrlsProps> = async () => {
  const userUrls = await prisma.userUrl
    .findMany({
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        url: {
          select: {
            id: true,
            url: true,
            metadata: true,
          },
        },
      },
    })
    .then((data) =>
      data.map(({ id, createdAt, user, url }) => ({
        id,
        createdAt: createdAt.toISOString(),
        url: {
          ...url,
          metadata: decompressMetadata(url.metadata as Object),
        },
        user,
      }))
    );

  return {
    props: {
      userUrls,
    },
  };
};
