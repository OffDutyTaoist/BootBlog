// src/lib/db/queries/feeds.ts

import { db } from "..";
import { feeds, users, type Feed, type User } from "../schema";
import { eq, sql } from "drizzle-orm";

export async function createFeed(
  name: string,
  url: string,
  userId: string
) {
  const [result] = await db
    .insert(feeds)
    .values({ name, url, userId })
    .returning();

  return result;
}

export type FeedWithUser = {
  feed: Feed;
  user: User;
};

export async function getFeedsWithUsers(): Promise<FeedWithUser[]> {
  const rows = await db
    .select({
      feed: feeds,
      user: users,
    })
    .from(feeds)
    .innerJoin(users, eq(feeds.userId, users.id));

  return rows;
}

export async function getFeedByUrl(url: string): Promise<Feed | null> {
  const rows = await db
    .select()
    .from(feeds)
    .where(eq(feeds.url, url));

  return rows[0] ?? null;
}

export async function markFeedFetched(feedId: string): Promise<void> {
  const now = new Date();

  await db
    .update(feeds)
    .set({
      lastFetchedAt: now,
      updatedAt: now,
    })
    .where(eq(feeds.id, feedId));
}

export async function getNextFeedToFetch(): Promise<Feed | null> {
  const rows = await db
    .select()
    .from(feeds)
    // Oldest first, NULLs (never fetched) first
    .orderBy(sql`${feeds.lastFetchedAt} NULLS FIRST`)
    .limit(1);

  return rows[0] ?? null;
}
