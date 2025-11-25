// src/lib/db/queries/posts.ts

import { db } from "..";
import {
  posts,
  feeds,
  feedFollows,
  type Post,
} from "../schema";
import { eq, desc } from "drizzle-orm";

export async function createPost(params: {
  title: string;
  url: string;
  description: string;
  publishedAt: Date | null;
  feedId: string;
}): Promise<Post | null> {
  const { title, url, description, publishedAt, feedId } = params;

  const [inserted] = await db
    .insert(posts)
    .values({
      title,
      url,
      description,
      publishedAt,
      feedId,
    })
    .onConflictDoNothing({ target: posts.url }) // avoid duplicate posts
    .returning();

  return inserted ?? null;
}

export type PostWithFeed = {
  post: Post;
  feedName: string;
};

export async function getPostsForUser(
  userId: string,
  limit: number,
): Promise<PostWithFeed[]> {
  const rows = await db
    .select({
      post: posts,
      feedName: feeds.name,
    })
    .from(posts)
    .innerJoin(feeds, eq(posts.feedId, feeds.id))
    .innerJoin(feedFollows, eq(feedFollows.feedId, feeds.id))
    .where(eq(feedFollows.userId, userId))
    .orderBy(
      desc(posts.publishedAt),
      desc(posts.createdAt),
    )
    .limit(limit);

  return rows;
}
