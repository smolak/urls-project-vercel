import Head from "next/head";
import { ReactElement } from "react";
import { LoggedInUserLayout } from "../../lib/core/ui/LoggedInUserLayout";
import { NextPageWithLayout } from "../_app";
import { SessionProvider } from "next-auth/react";
import { useForm, FieldValues } from "react-hook-form";
import { api } from "../../utils/api";

const UrlAdd: NextPageWithLayout = () => {
  const { register, handleSubmit } = useForm();
  const { mutate: addUrl } = api.url.createUrl.useMutation();
  const onSubmit = (values: FieldValues) => {
    const url = values.url as string;

    addUrl({ url });
  };

  return (
    <div>
      <Head>
        <title>Add new URL</title>
        <meta name="description" content="Add new URL" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>Add new URL</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("url")} type="url" autoFocus={true} />
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
