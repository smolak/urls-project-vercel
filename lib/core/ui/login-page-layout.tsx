import { FC, PropsWithChildren } from "react";
import Link from "next/link";
import { Logo } from "../../shared/ui/logo";
import { Footer } from "./footer";

export const LoginPageLayout: FC<PropsWithChildren> = ({ children }) => {
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
        </div>
      </div>

      <div className="container py-10">
        <main className="">{children}</main>
      </div>

      <Footer />
    </>
  );
};
