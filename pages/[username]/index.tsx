import { GetServerSideProps, NextPage } from "next";
import prisma from "../../prisma";
import { usernameSchema } from "../../lib/user-profile-data/schemas/user-profile-data.schema";
import { StatusCodes } from "http-status-codes";
import { PUBLIC_USER_DATA_SELECT_FRAGMENT } from "../../lib/user/models/fragments";
import { PUBLIC_USER_PROFILE_DATA_SELECT_FRAGMENT } from "../../lib/user-profile-data/models/fragments";
import { decompressMetadata } from "../../lib/metadata/compression";
import { UserImage } from "../../lib/user/ui/user-image";
import { ToggleFollowUser } from "../../lib/follow-user/ui/toggle-follow-user";
import { getToken } from "next-auth/jwt";
import { FeedVM } from "../../lib/feed/models/feed.vm";
import { UserFeedList } from "../../lib/feed/ui/user-feed-list/user-feed-list";
import { getUserFeed } from "../../lib/feed/prisma/get-user-feed";

type Self = {
  id: string;
} | null;

type UserProfilePageProps =
  | {
      self: Self;
      userData: {
        username: string;
        user: {
          id: string;
          name: string;
          image: string;
          createdAt: string;
        };
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
    const canToggleFollow = props.self?.id && props.self.id !== props.userData.user.id;

    return (
      <section className="mx-auto my-3 max-w-[700px]">
        <div className="flex items-center gap-2 mb-3">
          <UserImage {...props.userData.user} />
          <p>@{props.userData.username}</p>
          {canToggleFollow && (
            <div className="ml-4">
              <ToggleFollowUser userId={props.userData.user.id} />
            </div>
          )}
        </div>

        <UserFeedList feed={props.feed} />
      </section>
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
      user: {
        select: PUBLIC_USER_DATA_SELECT_FRAGMENT,
      },
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

  const feedRawEntries = await getUserFeed(maybePublicUserData.user.id as string);

  const feed = feedRawEntries.map((entry) => {
    return {
      id: entry.feed_id,
      createdAt: entry.feed_createdAt.toISOString(),
      user: {
        name: entry.user_name,
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

  const serializedUserData = {
    ...maybePublicUserData,
    user: {
      ...maybePublicUserData.user,
      createdAt: maybePublicUserData?.user?.createdAt?.toISOString(),
    },
  };

  return { props: { userData: serializedUserData, feed, self } };
};
