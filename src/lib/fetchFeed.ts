// src/lib/fetchFeed.ts
import { XMLParser } from "fast-xml-parser";
import type { RSSFeed, RSSItem } from "../types/rss.js";

export async function fetchFeed(feedURL: string): Promise<RSSFeed> {
  const res = await fetch(feedURL, {
    headers: {
      "User-Agent": "gator",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch feed: ${res.status} ${res.statusText}`);
  }

  const xml = await res.text();

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
  });

  const parsed = parser.parse(xml);

  if (!parsed.rss || !parsed.rss.channel) {
    throw new Error("Invalid RSS feed: missing rss.channel");
  }

  const channel = parsed.rss.channel;

  const title = channel.title;
  const link = channel.link;
  const description = channel.description;

  if (
    typeof title !== "string" ||
    typeof link !== "string" ||
    typeof description !== "string"
  ) {
    throw new Error("Invalid or missing channel metadata in RSS feed.");
  }

  let itemsRaw = channel.item ?? [];

  if (!Array.isArray(itemsRaw)) {
    itemsRaw = [];
  }

  const items: RSSItem[] = [];

  for (const item of itemsRaw) {
    if (
      typeof item.title !== "string" ||
      typeof item.link !== "string" ||
      typeof item.description !== "string" ||
      typeof item.pubDate !== "string"
    ) {
      continue;
    }

    items.push({
      title: item.title,
      link: item.link,
      description: item.description,
      pubDate: item.pubDate,
    });
  }

  return {
    title,
    link,
    description,
    items,
  };
}
