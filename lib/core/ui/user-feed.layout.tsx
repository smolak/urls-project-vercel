import { FC, ReactNode } from "react";
import { Footer } from "./footer";

import { MainHeader } from "../../shared/ui/main-header";

type UserFeedLayoutProps = {
  mainContent: ReactNode;
  rightColumnContent: ReactNode;
};

export const UserFeedLayout: FC<UserFeedLayoutProps> = ({ mainContent, rightColumnContent }) => {
  return (
    <>
      <MainHeader />

      <div className="container py-10">
        <div className="grid grid-cols-9 gap-10">
          <div className="col-span-2">Stuff will appear here</div>
          <div className="col-span-5 flex flex-col gap-10">
            <main>{mainContent}</main>
          </div>
          <div className="col-span-2">{rightColumnContent}</div>
        </div>
      </div>

      <Footer />
    </>
  );
};
