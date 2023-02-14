/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverRuntimeConfig: {
    feedQueueApiKey: process.env.FEED_QUEUE_API_KEY,
    userFeedList: {
      itemsPerFetch: 30,
    },
  },
};

module.exports = nextConfig;
