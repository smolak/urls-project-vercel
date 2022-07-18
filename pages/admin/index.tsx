import { nextAuthOptions } from "../api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { NextPageWithLayout } from "../_app";
import { AdminLayout } from "./AdminLayout";
import { User } from "next-auth";

const AdminPage: NextPageWithLayout<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ user }) => {
  return (
    <AdminLayout title="Dashboard" user={user}>
      <div>Content here</div>
    </AdminLayout>
  );
};

export default AdminPage;

interface AdminPageProps {
  user: User;
}

const normalizeForServerSideProps = (user: User) => {
  user.image = user.image || null;

  return user;
};

export const getServerSideProps: GetServerSideProps<AdminPageProps> = async (context) => {
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
