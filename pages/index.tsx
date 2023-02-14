import Head from "next/head";
import { ReactElement } from "react";
import { LoggedInUserLayout } from "../lib/core/ui/LoggedInUserLayout";
import { NextPageWithLayout } from "./_app";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const Home: NextPageWithLayout = () => {
  return (
    <div>
      <Head>
        <title>Homepage</title>
        <meta name="description" content="URLs project (beta)" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>Welcome to urlshare.me (alpha)</h1>
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
