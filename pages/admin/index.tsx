import { nextAuthOptions } from "../api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import { GetServerSideProps, NextPage } from "next";

const AdminPage: NextPage = () => {
  return <h2>Admin page</h2>;
};

export default AdminPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(context.req, context.res, nextAuthOptions);

  if (!session) {
    return {
      notFound: true,
    };
  }

  return { props: {} };
};
