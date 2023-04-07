import { SessionUser } from "next-auth";
import { GetServerSideProps } from "next";
import { getServerAuthSession } from "../../../server/auth";

interface AdminPageProps {
  user: SessionUser;
}

const normalizeForServerSideProps = (user: SessionUser) => {
  user.image = user.image || null;

  return user;
};

export const getServerProps: GetServerSideProps<AdminPageProps> = async (context) => {
  const session = await getServerAuthSession(context);

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
