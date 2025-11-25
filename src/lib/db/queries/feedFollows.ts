// src/lib/db/queries/feedFollows.ts

import { db } from "..";
import { 
    feedFollows, 
    feeds, 
    users, 
    type FeedFollow, 
    type Feed, 
    type User 
} from "../schema";
import { eq, and } from "drizzle-orm";
import { getFeedByUrl } from "./feeds.js";

export type FeedFollowWithNames = FeedFollow & {
  userName: string;
  feedName: string;
};

// Insert a follow and return follow fields + user/feed names
export async function createFeedFollow(
  userId: string,
  feedId: string,
): Promise<FeedFollowWithNames> {
  const [inserted] = await db
    .insert(feedFollows)
    .values({ userId, feedId })
    .returning();

  const [joined] = await db
    .select({
      follow: feedFollows,
      user: users,
      feed: feeds,
    })
    .from(feedFollows)
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .where(eq(feedFollows.id, inserted.id));

  return {
    ...joined.follow,
    userName: joined.user.name,
    feedName: joined.feed.name,
  };
}

// Get em boy, get this users!
export async function getFeedFollowsForUser(
  userId: string,
): Promise<FeedFollowWithNames[]> {
  const rows = await db
    .select({
      follow: feedFollows,
      user: users,
      feed: feeds,
    })
    .from(feedFollows)
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .where(eq(feedFollows.userId, userId));

  return rows.map((row) => ({
    ...row.follow,
    userName: row.user.name,
    feedName: row.feed.name,
  }));
}

export async function deleteFeedFollowByUserAndUrl(
  userId: string,
  url: string,
): Promise<number> {
  const feed = await getFeedByUrl(url);
  if (!feed) {
    return 0;
  }

  const deleted = await db
    .delete(feedFollows)
    .where(
      and(
        eq(feedFollows.userId, userId),
        eq(feedFollows.feedId, feed.id),
      ),
    )
    .returning();

  return deleted.length;
}

