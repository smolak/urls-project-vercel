import Head from "next/head";
import { ReactElement } from "react";
import { LoggedInUserLayout } from "../lib/core/ui/LoggedInUserLayout";
import { NextPageWithLayout } from "./_app";
import { SessionProvider } from "next-auth/react";

const Home: NextPageWithLayout = () => {
  return (
    <div>
      <Head>
        <title>Homepage</title>
        <meta name="description" content="URLs project (beta)" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>Welcome to URLs project (beta)</h1>
    </div>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return (
    <SessionProvider>
      <LoggedInUserLayout>{page}</LoggedInUserLayout>
    </SessionProvider>
  );
};

export default Home;
