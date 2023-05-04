const browserless = require("browserless")();
const getHTML = require("html-get");
const metascraper = require("metascraper")([
  require("metascraper-audio")(),
  require("metascraper-author")(),
  require("metascraper-date")(),
  require("metascraper-description")(),
  require("metascraper-image")(),
  require("metascraper-lang")(),
  require("metascraper-logo")(),
  require("metascraper-logo-favicon")(),
  require("metascraper-media-provider")(),
  require("metascraper-publisher")(),
  require("metascraper-title")(),
  require("metascraper-url")(),
  require("metascraper-video")(),
  require("metascraper-instagram")(),
  require("metascraper-spotify")(),
  require("metascraper-twitter")(),
  require("metascraper-youtube")(),
]);

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

const getContent = async (url: string) => {
  // create a browser context inside the main Chromium process
  const browserContext = browserless.createContext();
  const promise = getHTML(url, { prerender: true, getBrowserless: () => browserContext });

  // close browser resources before return the result
  // @ts-ignore
  promise.then(() => browserContext).then((browser) => browser.destroyContext());

  return promise;
};

export type GetMetadata = (url: URL, html?: string) => Promise<Metadata>;

const metascraperMetadataMapper: Record<string, keyof Metadata> = {
  audio: "audio",
  author: "author",
  date: "published",
  description: "description",
  image: "image",
  lang: "language",
  logo: "icon",
  publisher: "provider",
  title: "title",
  url: "url",
  video: "video",
};

export const getMetadata: GetMetadata = (url) =>
  getContent(url)
    .then(metascraper)
    .then((data) => {
      return Object.entries(data as Record<string, string>).reduce((metadata, [key, val]) => {
        return {
          ...metadata,
          [metascraperMetadataMapper[key]]: val,
        } as Metadata;
      }, {});
    })
    .finally(() => browserless.close());
