interface RSSItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
}

interface RSSChannel {
  title: string;
  link: string;
  description: string;
  items: RSSItem[];
}

export function generateRssFeed(channel: RSSChannel): string {
  const pubDate = new Date().toUTCString();
  const items = channel.items
    .map(
      (item) => `
    <item>
      <title>${item.title}</title>
      <description>${item.description}</description>
      <link>${item.link}</link>
      <pubDate>${item.pubDate}</pubDate>
    </item>
  `
    )
    .join("");

  return `
    <?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0">
      <channel>
        <title>${channel.title}</title>
        <link>${channel.link}</link>
        <description>${channel.description}</description>
        <pubDate>${pubDate}</pubDate>
        ${items}
      </channel>
    </rss>
  `;
}
