// src/handlerBrowse.ts

import type { UserCommandHandler } from "./commands.js";
import { getPostsForUser } from "./lib/db/queries/posts.js";

export const handlerBrowse: UserCommandHandler = async (
  cmdName,
  user,
  ...args
) => {
  let limit = 2;

  if (args.length > 0) {
    const parsed = Number(args[0]);
    if (Number.isNaN(parsed) || parsed <= 0) {
      throw new Error("Limit must be a positive number.");
    }
    limit = parsed;
  }

  const posts = await getPostsForUser(user.id, limit);

  if (posts.length === 0) {
    console.log("No posts found.");
    return;
  }

  for (const row of posts) {
    const p = row.post;
    console.log(`* [${row.feedName}] ${p.title}`);
    console.log(`  ${p.url}`);
    if (p.publishedAt) {
      console.log(`  Published: ${p.publishedAt.toISOString()}`);
    }
  }
};
