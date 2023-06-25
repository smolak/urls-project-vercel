import { FC, PropsWithChildren } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Logo } from "../../shared/ui/logo";
import { Footer } from "./footer";

export const LoggedInUserLayout: FC<PropsWithChildren> = ({ children }) => {
  const { data: session, status } = useSession();

  return (
    <>
      <div className="min-h-full p-2">
        <div className="navbar bg-base-200 rounded-box">
          <div className="flex-none w-52">
            <Logo withName />
          </div>
          <div className="flex-auto"></div>
          <div className="flex-none justify-end w-52">
            {status === "loading" && <div className="btn btn-ghost loading" />}
            {status === "unauthenticated" && (
              <Link className="btn" href="/auth/login">
                Login
              </Link>
            )}
            {status === "authenticated" && (
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full">
                    <img src={session.user.image as string} alt={session.user.name as string} />
                  </div>
                </label>
                <ul
                  tabIndex={0}
                  className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-200 rounded-box w-52"
                >
                  <li>
                    <Link href="/settings/profile" className="justify-between">
                      Profile
                      <span className="badge">New</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/settings">Settings</Link>
                  </li>
                  <li>
                    <a onClick={() => signOut()}>Logout</a>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-12 gap-16">
          <main className="col-start-3 col-span-8">{children}</main>
        </div>
      </div>
      <Footer />
    </>
  );
};
