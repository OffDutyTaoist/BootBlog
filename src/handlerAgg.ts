// src/handlerAgg.ts

import type { CommandHandler } from "./commands.js";
import { scrapeFeeds } from "./lib/scrapeFeeds.js";

function parseDuration(durationStr: string): number {
  const regex = /^(\d+)(ms|s|m|h)$/;
  const match = durationStr.match(regex);

  if (!match) {
    throw new Error(
      `Invalid duration string "${durationStr}". Use formats like 500ms, 1s, 1m, 1h.`,
    );
  }

  const value = Number(match[1]);
  const unit = match[2];

  switch (unit) {
    case "ms":
      return value;
    case "s":
      return value * 1000;
    case "m":
      return value * 60 * 1000;
    case "h":
      return value * 60 * 60 * 1000;
    default:
      throw new Error(`Unknown duration unit: ${unit}`);
  }
}

function formatDuration(ms: number): string {
  // Simple pretty printer: 60000 → "1m0s", 1000 → "1s"
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h${minutes}m${seconds}s`;
  }
  if (minutes > 0) {
    return `${minutes}m${seconds}s`;
  }
  return `${seconds}s`;
}

export const handlerAgg: CommandHandler = async (cmdName, ...args) => {
  if (args.length === 0) {
    throw new Error("agg requires a time_between_reqs argument, e.g. 10s or 1m.");
  }

  const durationStr = args[0];
  const timeBetweenRequests = parseDuration(durationStr);

  console.log(`Collecting feeds every ${formatDuration(timeBetweenRequests)}.`);

  const handleError = (err: any) => {
    console.error("Error during scrapeFeeds:", err?.message ?? err);
  };

  // Run once immediately
  await scrapeFeeds().catch(handleError);

  // Then schedule repeated runs
  const interval = setInterval(() => {
    scrapeFeeds().catch(handleError);
  }, timeBetweenRequests);

  // Keep process alive until Ctrl+C
  await new Promise<void>((resolve) => {
    process.on("SIGINT", () => {
      console.log("Shutting down feed aggregator...");
      clearInterval(interval);
      resolve();
    });
  });
};

