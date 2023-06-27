import { FC, PropsWithChildren } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Logo } from "../../shared/ui/logo";
import { Footer } from "./footer";
import { useRouter } from "next/router";
import clsx from "clsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Avatar, AvatarImage } from "../../components/ui/avatar";
import { LoadingIndicator } from "./loading-indicator";
import { LogOut, User2 } from "lucide-react";

export const LoggedInUserLayout: FC<PropsWithChildren> = ({ children }) => {
  const { data: session, status } = useSession();
  const { pathname } = useRouter();

  return (
    <>
      <div className="supports-backdrop-blur:bg-background/60 sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex items-center h-16">
          <div className="flex items-center space-x-8">
            <Logo withName />
            <nav>
              <ol className="flex items-center space-x-6 text-sm font-medium">
                <li>
                  <Link
                    href="/"
                    className={clsx(
                      pathname === "/" ? "text-primary" : "text-secondary",
                      "transition-colors hover:text-slate-800"
                    )}
                  >
                    Homepage
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className={clsx(
                      pathname === "/about" ? "text-primary" : "text-secondary",
                      "transition-colors hover:text-slate-800"
                    )}
                  >
                    About
                  </Link>
                </li>
              </ol>
            </nav>
          </div>

          <div className="flex flex-1 justify-end items-center">
            {status === "loading" && <LoadingIndicator label="Checking session..." />}
            {status === "unauthenticated" && (
              <Link className="" href="/auth/login">
                Login
              </Link>
            )}
            {status === "authenticated" && (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar className="hover:outline hover:outline-slate-400 outline-1 border-2 border-white h-11 w-11">
                    <AvatarImage src={session.user.image as string} alt={session.user.name as string} />
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="gap-2">
                    <User2 size={12} />
                    <Link href="/settings/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2">
                    <LogOut size={12} />
                    <a className="cursor-pointer" onClick={() => signOut()}>
                      Logout
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>

      <div className="container py-10">
        <main className="">{children}</main>
      </div>

      <Footer />
    </>
  );
};
