// src/handlerFollow.ts

import type { CommandHandler } from "./commands.js";
import { readConfig } from "./config.js";
import { getUserByName } from "./lib/db/queries/users.js";
import { getFeedByUrl } from "./lib/db/queries/feeds.js";
import { createFeedFollow } from "./lib/db/queries/feedFollows.js";

export const handlerFollow: CommandHandler = async (cmdName, ...args) => {
  if (args.length === 0) {
    throw new Error("follow requires a feed URL.");
  }

  const url = args[0];

  const cfg = readConfig();
  if (!cfg.currentUserName) {
    throw new Error("No current user set. Please login first.");
  }

  const user = await getUserByName(cfg.currentUserName);
  if (!user) {
    throw new Error(`Current user "${cfg.currentUserName}" does not exist.`);
  }

  const feed = await getFeedByUrl(url);
  if (!feed) {
    throw new Error(`Feed with URL "${url}" does not exist.`);
  }

  const follow = await createFeedFollow(user.id, feed.id);

  console.log(`User "${follow.userName}" is now following "${follow.feedName}".`);
};
