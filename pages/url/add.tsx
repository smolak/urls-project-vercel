import Head from "next/head";
import { ReactElement, useEffect } from "react";
import { LoggedInUserLayout } from "../../lib/core/ui/LoggedInUserLayout";
import { NextPageWithLayout } from "../_app";
import { SessionProvider } from "next-auth/react";
import { useForm, FieldValues } from "react-hook-form";
import axios from "axios";

const UrlAdd: NextPageWithLayout = () => {
  const { register, handleSubmit, setFocus } = useForm();
  const onSubmit = ({ url }: FieldValues) => {
    axios.post("/api/url", { url }).then(console.log);
  };

  useEffect(() => {
    setFocus("url");
  }, [setFocus]);

  return (
    <div>
      <Head>
        <title>Add new URL</title>
        <meta name="description" content="Add new URL" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>Add new URL</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("url")} type="url" />
        <input type="submit" value="Add" />
      </form>
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
