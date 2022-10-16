import { FC } from "react";
import { LoadingUrls } from "./LoadingUrls";
import { ErrorLoadingUrls } from "./ErrorLoadingUrls";
import { UrlList } from "./UrlList";
import { useUrlsQuery } from "../../hooks/useUrlsQuery";

export const UrlListConnected: FC = () => {
  const { isLoading, isError, data, error } = useUrlsQuery();

  if (isLoading) {
    return <LoadingUrls />;
  }

  if (isError) {
    return <ErrorLoadingUrls error={error} />;
  }

  return <UrlList urls={data} />;
};
