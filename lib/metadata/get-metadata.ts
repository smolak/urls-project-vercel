import _getMetadata from "metadata-scraper";

type URL = string;

export interface Metadata {
  audio?: string;
  author?: string;
  contentType?: string;
  copyright?: string;
  description?: string;
  email?: string;
  facebook?: string;
  icon?: string;
  image?: string;
  keywords?: ReadonlyArray<string>;
  language?: string;
  modified?: string;
  provider?: string;
  published?: string;
  robots?: ReadonlyArray<string>;
  section?: string;
  title?: string;
  twitter?: string;
  type?: string;
  url?: string;
  video?: string;
}

export type GetMetadata = (url: URL, html?: string) => Promise<Metadata>;

export const getMetadata: GetMetadata = async (url, html) => {
  const options = {
    url,
    html,
  };

  return (await _getMetadata(options)) as unknown as Promise<Metadata>;
};
