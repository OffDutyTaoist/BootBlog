// src/lib/printFeed.ts

import type { Feed, User } from "./db/schema.js";

export function printFeed(feed: Feed, user: User): void {
  console.log("Feed:");
  console.log(`  id: ${feed.id}`);
  console.log(`  name: ${feed.name}`);
  console.log(`  url: ${feed.url}`);
  console.log(`  user: ${user.name} (${user.id})`);
  console.log(`  created_at: ${feed.createdAt}`);
  console.log(`  updated_at: ${feed.updatedAt}`);
}
