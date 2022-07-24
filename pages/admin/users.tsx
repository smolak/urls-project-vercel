import { InferGetServerSidePropsType } from "next";
import { NextPageWithLayout } from "../_app";
import { AdminLayout, Page } from "../../lib/pages/admin/AdminLayout";
import { getServerProps } from "../../lib/pages/admin/getServerProps";
import { UserList } from "../../lib/admin/user/ui/UserList";

const AdminUsersPage: NextPageWithLayout<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ user }) => {
  return (
    <AdminLayout title="Users" user={user} page={Page.USERS}>
      <UserList />
    </AdminLayout>
  );
};

export default AdminUsersPage;

export const getServerSideProps = getServerProps;
