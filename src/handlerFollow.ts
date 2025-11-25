// src/handlerFollow.ts

import type { UserCommandHandler } from "./commands.js";
import { getFeedByUrl } from "./lib/db/queries/feeds.js";
import { createFeedFollow } from "./lib/db/queries/feedFollows.js";

export const handlerFollow: UserCommandHandler = async (
  cmdName,
  user,
  ...args
) => {
  if (args.length === 0) {
    throw new Error("follow requires a feed URL.");
  }

  const url = args[0];

  const feed = await getFeedByUrl(url);
  if (!feed) {
    throw new Error(`Feed with URL "${url}" does not exist.`);
  }

  const follow = await createFeedFollow(user.id, feed.id);

  console.log(
    `User "${follow.userName}" is now following "${follow.feedName}".`,
  );
};
