// src/lib/scrapeFeeds.ts

import { getNextFeedToFetch, markFeedFetched } from "./db/queries/feeds.js";
import { fetchFeed } from "./fetchFeed.js";
import { createPost } from "./db/queries/posts.js";

function parsePublishedAt(pubDate: string | undefined): Date | null {
  if (!pubDate) return null;
  const d = new Date(pubDate);
  if (Number.isNaN(d.getTime())) {
    return null;
  }
  return d;
}

export async function scrapeFeeds(): Promise<void> {
  const feedRecord = await getNextFeedToFetch();

  if (!feedRecord) {
    console.log("No feeds found to fetch.");
    return;
  }

  console.log(`\nFetching feed: ${feedRecord.name} (${feedRecord.url})`);

  await markFeedFetched(feedRecord.id);

  const rss = await fetchFeed(feedRecord.url);

  console.log(`Feed title: ${rss.title}`);
  console.log(`Found ${rss.items.length} posts, saving to database...`);

  for (const item of rss.items) {
    const publishedAt = parsePublishedAt(item.pubDate);

    try {
      const saved = await createPost({
        title: item.title,
        url: item.link,
        description: item.description,
        publishedAt,
        feedId: feedRecord.id,
      });

      if (saved) {
        console.log(`  Saved post: ${saved.title}`);
      } else {
        console.log(`  Skipped existing post: ${item.title}`);
      }
    } catch (err: any) {
      console.error(`  Error saving post "${item.title}":`, err.message ?? err);
    }
  }
}
