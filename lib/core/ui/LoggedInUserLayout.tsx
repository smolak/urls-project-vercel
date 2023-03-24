import { FC, PropsWithChildren } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Logo } from "../../shared/ui/Logo";
import { RiGithubFill } from "react-icons/ri";

export const LoggedInUserLayout: FC<PropsWithChildren> = ({ children }) => {
  const { data: session, status } = useSession();

  return (
    <>
      <div className="min-h-full p-2">
        <div className="navbar bg-base-200 rounded-box mb-5">
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

        <main>{children}</main>
      </div>

      <footer className="footer items-center p-4 bg-neutral text-neutral-content">
        <div className="items-center grid-flow-col">
          <Logo iconSize={36} />
          <p>Copyright © 2023 - All right reserved</p>
        </div>
        <div className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
          <a href="https://github.com/smolak/urls-project-vercel" target="_blank">
            <RiGithubFill className="inline" size={36} />
          </a>
        </div>
      </footer>
    </>
  );
};
