import { InferGetServerSidePropsType } from "next";
import { NextPageWithLayout } from "../_app";
import { AdminLayout, Page } from "../../lib/pages/admin/admin-layout";
import { getServerProps } from "../../lib/pages/admin/get-server-props";
import { UserList } from "../../lib/admin/user/ui/user-list";

const AdminUsersPage: NextPageWithLayout<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ user }) => {
  return (
    <AdminLayout title="Users" user={user} page={Page.USERS}>
      <UserList />
    </AdminLayout>
  );
};

export default AdminUsersPage;

export const getServerSideProps = getServerProps;
