import { FC, ReactNode } from "react";
import { Footer } from "./footer";

type UserFeedLayoutProps = {
  feed: ReactNode;
  userProfileCard: ReactNode;
};

export const UserFeedLayout: FC<UserFeedLayoutProps> = ({ feed, userProfileCard }) => {
  return (
    <>
      <div className="grid grid-cols-12 gap-16">
        <main className="col-span-8">{feed}</main>
        <aside className="col-span-4">{userProfileCard}</aside>
      </div>
      <Footer />
    </>
  );
};
