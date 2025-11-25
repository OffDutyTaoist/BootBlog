// src/handlerAddFeed.ts

import type { UserCommandHandler } from "./commands.js";
import { createFeed } from "./lib/db/queries/feeds.js";
import { createFeedFollow } from "./lib/db/queries/feedFollows.js";
import { printFeed } from "./lib/printFeed.js";

export const handlerAddFeed: UserCommandHandler = async (
  cmdName,
  user,
  ...args
) => {
  if (args.length < 2) {
    throw new Error("addfeed requires a name and url.");
  }

  const [name, url] = args;

  const feed = await createFeed(name, url, user.id);
  printFeed(feed, user);

  const follow = await createFeedFollow(user.id, feed.id);

  console.log(
    `User "${follow.userName}" is now following newly added feed "${follow.feedName}".`,
  );
};
