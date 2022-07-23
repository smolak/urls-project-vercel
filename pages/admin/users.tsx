import { InferGetServerSidePropsType } from "next";
import { format } from "date-fns";
import { NextPageWithLayout } from "../_app";
import { AdminLayout, Page } from "../../lib/pages/admin/AdminLayout";
import { useEffect, useState } from "react";
import { UserListOptions } from "../../lib/admin/user/ui/UserListOptions";
import { getServerProps } from "../../lib/pages/admin/getServerProps";

const AdminUsersPage: NextPageWithLayout<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ user }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api/user")
      .then((res) => res.json())
      .then((users) => setData(users));
  }, []);

  return (
    <AdminLayout title="Users" user={user} page={Page.USERS}>
      <div className="bg-white overflow-hidden sm:rounded-lg border border-gray-300 text-gray-900">
        <div className="bg-gray-100 px-3 py-3 sm:grid sm:grid-cols-10 sm:gap-3 sm:px-6 font-bold">
          <span className="pl-12 col-span-3">Name</span>
          <span className="col-span-3">Email</span>
          <span>Role</span>
          <span className="col-span-2">Created at</span>
          <span>Options</span>
        </div>

        {data.map(({ id, name, image, email, role, createdAt }) => {
          return (
            <div
              key={id}
              className="border-t border-gray-200 px-3 py-3 sm:grid sm:grid-cols-10 sm:gap-3 sm:px-6 text-sm"
            >
              <div className="flex items-center col-span-3">
                {image ? (
                  <img
                    className="h-8 w-8 rounded-full mr-4"
                    src="https://s.gravatar.com/avatar/b4b8160fad763019bb200ba1380b9f34?s=80"
                  />
                ) : (
                  <span className="h-8 w-8 mr-4" />
                )}
                <span>{name}</span>
              </div>
              <span className="flex items-center col-span-3">{email}</span>
              <span className="flex items-center">{role}</span>
              <span className="flex items-center col-span-2">
                {format(new Date(createdAt), "yyyy-MM-dd'T'HH:mm:ss")}
              </span>
              <span>
                <UserListOptions />
              </span>
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
};

export default AdminUsersPage;

export const getServerSideProps = getServerProps;
