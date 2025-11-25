// src/handlerFeeds.ts

import type { CommandHandler } from "./commands.js";
import { getFeedsWithUsers } from "./lib/db/queries/feeds.js";

export const handlerFeeds: CommandHandler = async (cmdName, ...args) => {
  if (args.length > 0) {
    throw new Error(`feeds command does not take any arguments.`);
  }

  const rows = await getFeedsWithUsers();

  if (rows.length === 0) {
    console.log("No feeds found.");
    return;
  }

  for (const { feed, user } of rows) {
    console.log(`* ${feed.name}`);
    console.log(`  URL: ${feed.url}`);
    console.log(`  User: ${user.name}`);
  }
};
