import { GetServerSideProps, NextPage } from "next";
import prisma from "../../prisma";
import { usernameSchema } from "../../lib/user-profile-data/schemas/user-profile-data.schema";
import { StatusCodes } from "http-status-codes";
import { PUBLIC_USER_PROFILE_DATA_SELECT_FRAGMENT } from "../../lib/user-profile-data/models/fragments";
import { getToken } from "next-auth/jwt";
import { FeedVM, toFeedVM } from "../../lib/feed/models/feed.vm";
import { UserFeedList } from "../../lib/feed/ui/user-feed-list/user-feed-list";
import { getUserFeed } from "../../lib/feed/prisma/get-user-feed";
import { UserFeedLayout } from "../../lib/core/ui/user-feed.layout";
import { UserProfileCard } from "../../lib/user-profile-data/ui/user-profile-card";
import Link from "next/link";
import { RssIcon } from "lucide-react";

type Self = {
  id: string;
} | null;

type UserProfilePageProps =
  | {
      self: Self;
      userData: {
        id: string;
        username: string;
        image: string;
        followers: number;
        following: number;
        likes: number;
        createdAt: string;
      };
      feed: ReadonlyArray<FeedVM>;
    }
  | {
      userData: null;
      feed: null;
      error: string;
      errorCode: number;
    };

const UserProfilePage: NextPage<UserProfilePageProps> = (props) => {
  if (props.userData) {
    const { self, userData, feed } = props;
    const myProfile = self?.id && self.id === userData.id;
    const canFollow = !myProfile || false;

    return (
      <UserFeedLayout
        mainContent={
          <section>
            <div className="mb-5 flex items-center justify-between">
              <h1 className="text-lg font-bold">{myProfile ? "My URLs" : `URLs added by ${userData.username}`}</h1>
              <Link href={`${userData.username}/rss.xml`} className="-mt-3 p-3">
                <RssIcon size={16} />
              </Link>
            </div>
            <UserFeedList feed={feed} />
          </section>
        }
        rightColumnContent={<UserProfileCard publicUserProfileData={userData} canFollow={canFollow} />}
      />
    );
  } else {
    return (
      <div>
        404 ... <code>{JSON.stringify(props.error)}</code>
      </div>
    );
  }
};

export default UserProfilePage;

export const getServerSideProps: GetServerSideProps = async ({ req, res, query }) => {
  const username = query.username;
  const parsingResult = usernameSchema.safeParse(username);

  if (!parsingResult.success) {
    res.statusCode = StatusCodes.NOT_FOUND;

    return {
      props: { error: parsingResult.error.message, errorCode: StatusCodes.NOT_FOUND, userData: null, urls: null },
    };
  }

  const token = await getToken({ req });
  const self = token
    ? {
        id: token.sub as string,
      }
    : null;

  const maybePublicUserData = await prisma.userProfileData.findUnique({
    where: {
      username: parsingResult.data,
    },
    select: {
      ...PUBLIC_USER_PROFILE_DATA_SELECT_FRAGMENT,
      userId: true,
    },
  });

  if (maybePublicUserData === null) {
    res.statusCode = StatusCodes.NOT_FOUND;

    return {
      props: {
        error: `User with username: '${parsingResult.data}' not found.`,
        errorCode: StatusCodes.NOT_FOUND,
        userData: null,
        feed: null,
      },
    };
  }

  const feedRawEntries = await getUserFeed(maybePublicUserData.userId);

  const feed = feedRawEntries.map((entry) => {
    return {
      ...toFeedVM(entry),
      createdAt: entry.feed_createdAt.toISOString(),
    };
  });

  const { userId, createdAt, ...userData } = maybePublicUserData;
  const serializedUserData = {
    ...userData,
    id: userId,
    createdAt: createdAt?.toISOString(),
  };

  return { props: { userData: serializedUserData, feed, self } };
};
