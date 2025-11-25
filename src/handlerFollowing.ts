// src/handlerFollowing.ts

import type { CommandHandler } from "./commands.js";
import { readConfig } from "./config.js";
import { getUserByName } from "./lib/db/queries/users.js";
import { getFeedFollowsForUser } from "./lib/db/queries/feedFollows.js";

export const handlerFollowing: CommandHandler = async (cmdName, ...args) => {
  if (args.length > 0) {
    throw new Error("following command does not take any arguments.");
  }

  const cfg = readConfig();
  if (!cfg.currentUserName) {
    throw new Error("No current user set. Please login first.");
  }

  const user = await getUserByName(cfg.currentUserName);
  if (!user) {
    throw new Error(`Current user "${cfg.currentUserName}" does not exist.`);
  }

  const follows = await getFeedFollowsForUser(user.id);

  if (follows.length === 0) {
    console.log("You are not following any feeds.");
    return;
  }

  for (const f of follows) {
    console.log(`* ${f.feedName}`);
  }
};
