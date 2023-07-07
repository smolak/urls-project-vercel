import { FC, PropsWithChildren } from "react";
import { SessionUser } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { Logo } from "../../shared/ui/logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { LogOut, User2 } from "lucide-react";
import { Footer } from "../../core/ui/footer";
import { UserImage } from "../../user/ui/user-image";

interface SettingsLayoutProps extends PropsWithChildren {
  title: string;
  user: SessionUser;
}

export const SettingsLayout: FC<SettingsLayoutProps> = ({ children, title, user }) => {
  return (
    <>
      <div className="supports-backdrop-blur:bg-background/60 sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex items-center h-16">
          <div className="flex items-center space-x-8">
            <Logo withName />
            <nav>
              <ol className="flex items-center space-x-6 text-sm font-medium">
                <li>
                  <Link href="/" className="text-secondary transition-colors hover:text-slate-800">
                    Homepage
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-secondary transition-colors hover:text-slate-800">
                    About
                  </Link>
                </li>
              </ol>
            </nav>
          </div>

          <div className="flex flex-1 justify-end items-center">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <UserImage username={user.name as string} image={user.image as string} size="small" />
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
          </div>
        </div>
      </div>

      <div className="container py-3">
        <header>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        </header>
        <main className="">{children}</main>
      </div>

      <Footer />
    </>
  );
};
