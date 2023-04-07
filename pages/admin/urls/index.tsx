import { InferGetServerSidePropsType } from "next";
import { NextPageWithLayout } from "../../_app";
import { AdminLayout, Page } from "../../../lib/pages/admin/admin-layout";
import { getServerProps } from "../../../lib/pages/admin/get-server-props";
import { UrlList } from "../../../lib/admin/urls/ui/url-list";

const AdminUrlsPage: NextPageWithLayout<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ user }) => {
  return (
    <AdminLayout title="URLs" user={user} page={Page.URLS}>
      <UrlList />
    </AdminLayout>
  );
};

export default AdminUrlsPage;

export const getServerSideProps = getServerProps;
