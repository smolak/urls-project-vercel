import { FC, PropsWithChildren } from "react";
import { Footer } from "./footer";
import { MainHeader } from "../../shared/ui/main-header";

export const LoggedInUserLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <MainHeader />
      <div className="container py-10">
        <main className="">{children}</main>
      </div>

      <Footer />
    </>
  );
};
