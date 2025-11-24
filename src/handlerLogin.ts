// src/handlerLogin.ts

import { readConfig, setUser } from "./config.js";
import type { CommandHandler } from "./commands.js";
import { getUserByName } from "./lib/db/queries/users.js";

export const handlerLogin: CommandHandler = async (cmdName, ...args) => {
  if (args.length === 0) {
    throw new Error("Username required for login.");
  }

  const username = args[0];
  const user = await getUserByName(username);

  if (!user) {
    throw new Error(`User "${username}" does not exist.`);
  }

  const cfg = readConfig();
  setUser(username, cfg);

  console.log(`Logged in as "${username}".`);
};
