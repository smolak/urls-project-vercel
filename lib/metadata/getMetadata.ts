import _getMetadata from "metadata-scraper";

type URL = string;

export interface Metadata {
  audio?: string;
  author?: string;
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

export const getMetadata = async (url: URL, html?: string) => {
  const options = {
    url,
    html,
  };

  const result = await _getMetadata(options);

  return result as Metadata;
};
