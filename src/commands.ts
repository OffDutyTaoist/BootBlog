// src/commands.ts

import type { User } from "./lib/db/schema.js";
import { readConfig } from "./config.js";
import { getUserByName } from "./lib/db/queries/users.js";

export type UserCommandHandler = (
  cmdName: string,
  user: User,
  ...args: string[]
) => Promise<void>;

export type CommandHandler = (
  cmdName: string, 
  ...args: string[]
) => Promise<void>;

export type CommandsRegistry = {
  [cmdName: string]: CommandHandler;
};

export function registerCommand(
  registry: CommandsRegistry,
  cmdName: string,
  handler: CommandHandler
) {
  registry[cmdName] = handler;
}

export async function runCommand(
  registry: CommandsRegistry,
  cmdName: string,
  ...args: string[]
): Promise<void> {
  const handler = registry[cmdName];
  if (!handler) {
    throw new Error(`Unknown command: ${cmdName}`);
  }
  await handler(cmdName, ...args);
}

export function middlewareLoggedIn(
  handler: UserCommandHandler,
): CommandHandler {
  return async (cmdName, ...args) => {
    const cfg = readConfig();

    if (!cfg.currentUserName) {
      throw new Error("A logged-in user is required for this command.");
    }

    const user = await getUserByName(cfg.currentUserName);

    if (!user) {
      throw new Error(
        `User "${cfg.currentUserName}" is set in config but does not exist in database.`,
      );
    }

    return handler(cmdName, user, ...args);
  };
}
