import { FC, PropsWithChildren } from "react";
import { useSession, signOut } from "next-auth/react";
import { RiLink } from "react-icons/ri";
import Link from "next/link";

export const LoggedInUserLayout: FC<PropsWithChildren> = ({ children }) => {
  const { data: session, status } = useSession();

  return (
    <>
      <div className="navbar bg-base-200 rounded-box mb-5">
        <div className="flex-none w-52">
          <Link href="/" className="btn btn-ghost normal-case text-xl flex space-x-2">
            <RiLink />
            <span className="font-extralight">urlshare.me</span>
          </Link>
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

      <main>{children}</main>
    </>
  );
};
