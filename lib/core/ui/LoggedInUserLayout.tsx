import { FC, PropsWithChildren } from "react";
import { LogoutButton } from "../../auth/LogoutButton";
import { useSession } from "next-auth/react";
import { LoadingIndicator } from "./LoadingIndicator";
import Link from "next/link";

export const LoggedInUserLayout: FC<PropsWithChildren> = ({ children }) => {
  const { data: session, status } = useSession();

  return (
    <>
      {status === "loading" && <LoadingIndicator title="Checking auth status" />}
      {status === "unauthenticated" && <Link href="/auth/login">Login</Link>}
      {status === "authenticated" && (
        <>
          <div>
            Hello, {session.user.name}. <LogoutButton />
          </div>
          <div>
            <Link href="/url/add">Add a URL</Link>
          </div>
        </>
      )}
      <main>{children}</main>
    </>
  );
};
