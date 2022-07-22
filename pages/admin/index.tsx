import { InferGetServerSidePropsType } from "next";
import { NextPageWithLayout } from "../_app";
import { AdminLayout, Page } from "../../lib/pages/admin/AdminLayout";
import { getServerProps } from "../../lib/pages/admin/getServerProps";

const AdminPage: NextPageWithLayout<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ user }) => {
  return (
    <AdminLayout title="Dashboard" user={user} page={Page.DASHBOARD}>
      <div>Content here</div>
    </AdminLayout>
  );
};

export default AdminPage;

export const getServerSideProps = getServerProps;
