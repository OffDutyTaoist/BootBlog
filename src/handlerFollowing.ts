// src/handlerFollowing.ts

import type { UserCommandHandler } from "./commands.js";
import { getFeedFollowsForUser } from "./lib/db/queries/feedFollows.js";

export const handlerFollowing: UserCommandHandler = async (
  cmdName,
  user,
  ...args
) => {
  if (args.length > 0) {
    throw new Error("following command does not take any arguments.");
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

