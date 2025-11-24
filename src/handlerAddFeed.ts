// src/handlerAddFeed.ts

import type { CommandHandler } from "./commands.js";
import { readConfig } from "./config.js";
import { getUserByName } from "./lib/db/queries/users.js";
import { createFeed } from "./lib/db/queries/feeds.js";
import { printFeed } from "./lib/printFeed.js";

export const handlerAddFeed: CommandHandler = async (cmdName, ...args) => {
  if (args.length < 2) {
    throw new Error("addfeed requires a name and url.");
  }

  const [name, url] = args;

  const cfg = readConfig();
  if (!cfg.currentUserName) {
    throw new Error("No current user set. Please login first.");
  }

  const user = await getUserByName(cfg.currentUserName);

  if (!user) {
    throw new Error(`Current user "${cfg.currentUserName}" does not exist.`);
  }

  const feed = await createFeed(name, url, user.id);

  // Show the new feed
  printFeed(feed, user);
};
