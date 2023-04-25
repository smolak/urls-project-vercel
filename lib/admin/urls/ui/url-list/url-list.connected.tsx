import { FC } from "react";
import { LoadingUrls } from "./loading-urls";
import { ErrorLoadingUrls } from "./error-loading-urls";
import { UrlList } from "./url-list";
import { api } from "../../../../../utils/api";

export const UrlListConnected: FC = () => {
  const { isLoading, isError, data, error } = api.url.getUrls.useQuery();

  if (isLoading) {
    return <LoadingUrls />;
  }

  if (isError) {
    return <ErrorLoadingUrls error={error} />;
  }

  return <UrlList urls={data} />;
};