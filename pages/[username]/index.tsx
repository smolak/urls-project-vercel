import { GetServerSideProps, NextPage } from "next";
import prisma from "../../prisma";
import { usernameSchema } from "../../lib/user-profile-data/schemas/user-profile-data.schema";
import { StatusCodes } from "http-status-codes";
import { PUBLIC_USER_PROFILE_DATA_SELECT_FRAGMENT } from "../../lib/user-profile-data/models/fragments";
import { decompressMetadata } from "../../lib/metadata/compression";
import { getToken } from "next-auth/jwt";
import { FeedVM } from "../../lib/feed/models/feed.vm";
import { UserFeedList } from "../../lib/feed/ui/user-feed-list/user-feed-list";
import { getUserFeed } from "../../lib/feed/prisma/get-user-feed";
import { UserFeedLayout } from "../../lib/core/ui/user-feed.layout";
import { UserProfileCard } from "../../lib/user-profile-data/ui/user-profile-card";

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
    const canFollow = (self?.id && self.id !== userData.id) || false;

    return (
      <UserFeedLayout
        feed={<UserFeedList feed={feed} />}
        userProfileCard={<UserProfileCard publicUserProfileData={userData} canFollow={canFollow} />}
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
      id: entry.feed_id,
      createdAt: entry.feed_createdAt.toISOString(),
      user: {
        image: entry.user_image,
        username: entry.user_username,
      },
      url: {
        url: entry.url_url,
        metadata: decompressMetadata(entry.url_metadata),
      },
      userUrlId: entry.userUrl_id,
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
