// src/handlerUnfollow.ts

import type { UserCommandHandler } from "./commands.js";
import { deleteFeedFollowByUserAndUrl } from "./lib/db/queries/feedFollows.js";

export const handlerUnfollow: UserCommandHandler = async (
  cmdName,
  user,
  ...args
) => {
  if (args.length === 0) {
    throw new Error("unfollow requires a feed URL.");
  }

  const url = args[0];

  const deletedCount = await deleteFeedFollowByUserAndUrl(user.id, url);

  if (deletedCount === 0) {
    throw new Error(
      `User "${user.name}" is not following a feed with URL "${url}".`,
    );
  }

  console.log(`User "${user.name}" unfollowed feed at "${url}".`);
};
