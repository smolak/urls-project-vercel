import { FC, ReactNode } from "react";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Logo } from "../../shared/ui/logo";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";
import { UserImage } from "../../user/ui/user-image";
import { cn } from "../../utils";
import { LoadingIndicator } from "../../core/ui/loading-indicator";
import { Footer } from "../../core/ui/footer";

type FollowingFollowersLayoutProps = {
  mainContent: ReactNode;
  rightColumnContent: ReactNode;
};

export const FollowingFollowersLayout: FC<FollowingFollowersLayoutProps> = ({ mainContent, rightColumnContent }) => {
  const { data: session, status } = useSession();
  const { pathname } = useRouter();

  return (
    <>
      <div className="supports-backdrop-blur:bg-background/60 bg-background/95 sticky top-0 z-40 w-full border-b backdrop-blur">
        <div className="container flex h-16 items-center">
          <div className="flex items-center space-x-8">
            <Logo withName />
            <nav>
              <ol className="flex items-center space-x-6 text-sm font-medium">
                <li>
                  <Link
                    href="/"
                    className={cn(
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
                    className={cn(
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

          <div className="flex flex-1 items-center justify-end">
            {status === "loading" && <LoadingIndicator label="Checking session..." />}
            {status === "unauthenticated" && <Link href="/auth/login">Login</Link>}
            {status === "authenticated" && (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <UserImage username={session.user.name as string} image={session.user.image as string} size="small" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="gap-2">
                    <User size={12} />
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
