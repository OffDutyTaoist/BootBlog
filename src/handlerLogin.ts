// src/handlerLogin.ts

import { readConfig, setUser } from "./config.js";
import type { CommandHandler } from "./commands.js";

export const handlerLogin: CommandHandler = (cmdName, ...args) => {
  if (args.length === 0) {
    throw new Error("Username required for login command.");
  }

  const username = args[0];
  const cfg = readConfig();

  setUser(username, cfg);

  console.log(`User set to "${username}".`);
};
