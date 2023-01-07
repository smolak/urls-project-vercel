import { GetServerSideProps, NextPage } from "next";
import prisma from "../../prisma";
import { usernameSchema } from "../../lib/user-profile-data/schemas/userProfileData.schema";
import { StatusCodes } from "http-status-codes";
import { PUBLIC_USER_DATA_SELECT_FRAGMENT } from "../../lib/user/models/fragments";
import { PUBLIC_USER_PROFILE_DATA_SELECT_FRAGMENT } from "../../lib/user-profile-data/models/fragments";
import { CompressedMetadata, decompressMetadata } from "../../lib/metadata/compression";
import { Url } from "@prisma/client";
import { Metadata } from "../../lib/metadata/getMetadata";
import { UserImage } from "../../lib/user/ui/UserImage";
import { ToggleFollowUser } from "../../lib/follow-user/ui/ToggleFollowUser";
import { getToken } from "next-auth/jwt";

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
      urls: ReadonlyArray<{
        id: Url["id"];
        url: Url["url"];
        metadata: Metadata;
        createdAt: string;
      }>;
    }
  | {
      userData: null;
      urls: null;
      error: string;
      errorCode: number;
    };

const UserProfilePage: NextPage<UserProfilePageProps> = (props) => {
  if (props.userData) {
    const canToggleFollow = props.self?.id && props.self.id !== props.userData.user.id;

    return (
      <section className="mx-auto my-3 max-w-[600px]">
        <div className="flex items-center gap-2 aspect-square w-8 object-cover">
          <UserImage {...props.userData.user} />
          <p>@{props.userData.username}</p>
          {canToggleFollow && (
            <div className="ml-4">
              <ToggleFollowUser userId={props.userData.user.id} />
            </div>
          )}
        </div>

        <ul className="space-y-2">
          {props.urls.map((url) => (
            <li key={url.id}>
              <div className="flex space-between space-x-4 rounded-md bg-white p-4 shadow-sm cursor-pointer hover:bg-slate-50">
                <div className="w-[510px]">
                  <h3 className="text-xl">
                    <a href={url.url} title={url.metadata.title} className="font-bold block">
                      {url.metadata.title || url.url}
                    </a>
                  </h3>
                  <p className="text-xs mb-2">({url.url})</p>
                  <img src={url.metadata.image} className="mb-2" />
                  <p className="text-sm">{url.metadata.description}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
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
        urls: null,
      },
    };
  }

  const urlsData = await prisma.userUrl.findMany({
    where: {
      userId: maybePublicUserData.user.id,
    },
    include: {
      url: {
        select: {
          id: true,
          url: true,
          metadata: true,
          createdAt: true,
        },
      },
    },
    orderBy: {
      url: {
        createdAt: "desc",
      },
    },
  });

  const urlsDataSerialized = urlsData.map(({ url }) => {
    return {
      id: url.id,
      url: url.url,
      createdAt: url.createdAt.toString(),
      metadata: decompressMetadata(url.metadata as CompressedMetadata),
    };
  });

  const serializedUserData = {
    ...maybePublicUserData,
    user: {
      ...maybePublicUserData.user,
      createdAt: maybePublicUserData?.user?.createdAt?.toISOString(),
    },
  };

  return { props: { userData: serializedUserData, urls: urlsDataSerialized, self } };
};
