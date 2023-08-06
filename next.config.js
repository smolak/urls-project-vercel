/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverRuntimeConfig: {
    feedQueueApiKey: process.env.FEED_QUEUE_API_KEY,
    urlQueueApiKey: process.env.URL_QUEUE_API_KEY,
    userFeedList: {
      itemsPerPage: 30,
    },
    rss: {
      itemsPerUserChannel: 20,
    },
  },
};

module.exports = nextConfig;
