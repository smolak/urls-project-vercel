import Head from "next/head";
import { ReactElement } from "react";
import { LoggedInUserLayout } from "../lib/core/ui/LoggedInUserLayout";
import { NextPageWithLayout } from "./_app";
import { SessionProvider, useSession } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserFeedList } from "../lib/feed/ui/UserFeedList";
import { AddUrl } from "../lib/url/ui/AddUrl";
import Link from "next/link";
import { RiGithubFill } from "react-icons/ri";
import { LoadingIndicator } from "../lib/core/ui/LoadingIndicator";

const queryClient = new QueryClient();

const Home: NextPageWithLayout = () => {
  const { status } = useSession();

  return (
    <div>
      <Head>
        <title>Homepage</title>
        <meta name="description" content="URLs project (beta)" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {status === "loading" && <LoadingIndicator title="Checking auth status..." />}
      {status === "unauthenticated" && (
        <div className="hero">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold">Hello there</h1>
              <p className="py-6">This is still an alpha version, things might not work as expected.</p>
              <p className="pb-6">
                <a href="https://github.com/smolak/urls-project-vercel" target="_blank">
                  <RiGithubFill className="inline" size={36} />
                </a>
              </p>
              <Link className="btn btn-primary" href="/auth/login">
                Login
              </Link>
            </div>
          </div>
        </div>
      )}
      {status === "authenticated" && (
        <div className="flex flex-col space-y-6 items-center">
          <AddUrl />
          <UserFeedList />
        </div>
      )}
    </div>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <LoggedInUserLayout>{page}</LoggedInUserLayout>
      </SessionProvider>
    </QueryClientProvider>
  );
};

export default Home;
