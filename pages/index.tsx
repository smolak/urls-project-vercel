import Head from "next/head";
import { ReactElement } from "react";
import { LoggedInUserLayout } from "../lib/core/ui/logged-in-user-layout";
import { NextPageWithLayout } from "./_app";
import { SessionProvider, useSession } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { InfiniteUserFeed } from "../lib/feed/ui/user-feed-list/infinite-user-feed";
import { AddUrl } from "../lib/url/ui/add-url";
import Link from "next/link";
import { LoadingIndicator } from "../lib/core/ui/loading-indicator";
import { buttonVariants } from "../lib/components/ui/button";
import { cn } from "../lib/utils";

const queryClient = new QueryClient();

const Home: NextPageWithLayout = () => {
  const { status, data } = useSession();

  return (
    <>
      <Head>
        <title>Homepage</title>
        <meta name="description" content="URLs project (beta)" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {status === "loading" && (
        <div className="flex flex-col items-center space-y-6">
          <LoadingIndicator label="Checking auth status..." />
        </div>
      )}
      {status === "unauthenticated" && (
        <section className="grid place-content-center py-20 text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Hello there</h1>
            <p className="py-6">This is still an alpha version, things might not work as expected.</p>
            <Link className={cn(buttonVariants({ variant: "link" }), "text-lg")} href="/auth/login">
              Login
            </Link>
          </div>
        </section>
      )}
      {status === "authenticated" && (
        <div className="flex flex-col gap-4 sm:gap-10">
          <aside>
            <AddUrl />
          </aside>
          <InfiniteUserFeed userId={data?.user.id} />
        </div>
      )}
    </>
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
