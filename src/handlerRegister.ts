// src/handlerRegister.ts

import { createUser, getUserByName } from "./lib/db/queries/users.js";
import { readConfig, setUser } from "./config.js";
import type { CommandHandler } from "./commands.js";

export const handlerRegister: CommandHandler = async (cmdName, ...args) => {
  if (args.length === 0) {
    throw new Error("Username required for register command.");
  }

  const username = args[0];

  const existing = await getUserByName(username);
  if (existing) {
    throw new Error(`User "${username}" already exists.`);
  }

  const newUser = await createUser(username);

  const cfg = readConfig();
  setUser(username, cfg);

  console.log(`Created user "${username}".`);
  console.log("User record:", newUser);
};
