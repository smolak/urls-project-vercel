import { User } from "next-auth";
import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { nextAuthOptions } from "../../../pages/api/auth/[...nextauth]";

interface AdminPageProps {
  user: User;
}

const normalizeForServerSideProps = (user: User) => {
  user.image = user.image || null;

  return user;
};

export const getServerProps: GetServerSideProps<AdminPageProps> = async (context) => {
  const session = await unstable_getServerSession(context.req, context.res, nextAuthOptions);

  if (!session || session.user.role !== "admin") {
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
