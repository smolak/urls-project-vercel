import { InferGetServerSidePropsType } from "next";
import { NextPageWithLayout } from "../../_app";
import { AdminLayout, Page } from "../../../lib/pages/admin/AdminLayout";
import { getServerProps } from "../../../lib/pages/admin/getServerProps";
import { UrlList } from "../../../lib/admin/urls/ui/UrlList";

const AdminUrlsPage: NextPageWithLayout<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ user }) => {
  return (
    <AdminLayout title="URLs" user={user} page={Page.URLS}>
      <UrlList />
    </AdminLayout>
  );
};

export default AdminUrlsPage;

export const getServerSideProps = getServerProps;
