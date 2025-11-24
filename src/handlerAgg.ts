// src/handlerAgg.ts

import type { CommandHandler } from "./commands.js";
import { fetchFeed } from "./lib/fetchFeed.js";

export const handlerAgg: CommandHandler = async (cmdName, ...args) => {
  const feedURL = "https://www.wagslane.dev/index.xml";

  try {
    const feed = await fetchFeed(feedURL);
    console.log(feed);
  } catch (err: any) {
    console.error("Error fetching/processing feed:", err.message);
    process.exit(1);
  }
};
