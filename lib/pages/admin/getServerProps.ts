import { SessionUser } from "next-auth";
import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { nextAuthOptions } from "../../../pages/api/auth/[...nextauth]";

interface AdminPageProps {
  user: SessionUser;
}

const normalizeForServerSideProps = (user: SessionUser) => {
  user.image = user.image || null;

  return user;
};

export const getServerProps: GetServerSideProps<AdminPageProps> = async (context) => {
  const session = await unstable_getServerSession(context.req, context.res, nextAuthOptions);

  if (!session || session.user.role !== "ADMIN") {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      user: normalizeForServerSideProps(session.user),
    },
  };
};
