import Head from "next/head";
import { ReactElement } from "react";
import { LoggedInUserLayout } from "../../lib/core/ui/logged-in-user-layout";
import { NextPageWithLayout } from "../_app";
import { SessionProvider } from "next-auth/react";
import { AddUrl } from "../../lib/url/ui/add-url";

const UrlAdd: NextPageWithLayout = () => {
  return (
    <div>
      <Head>
        <title>Add new URL</title>
        <meta name="description" content="Add new URL" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>Add new URL</h1>
      <AddUrl />
    </div>
  );
};

UrlAdd.getLayout = function getLayout(page: ReactElement) {
  return (
    <SessionProvider>
      <LoggedInUserLayout>{page}</LoggedInUserLayout>
    </SessionProvider>
  );
};

export default UrlAdd;
