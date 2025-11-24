// src/handlerUsers.ts

import type { CommandHandler } from "./commands.js";
import { getUsers } from "./lib/db/queries/users.js";
import { readConfig } from "./config.js";

export const handlerUsers: CommandHandler = async (cmdName, ...args) => {
  const cfg = readConfig();
  const currentUserName = cfg.currentUserName;

  const allUsers = await getUsers();

  if (allUsers.length === 0) {
    console.log("No users found.");
    return;
  }

  for (const user of allUsers) {
    const isCurrent = currentUserName && user.name === currentUserName;
    if (isCurrent) {
      console.log(`* ${user.name} (current)`);
    } else {
      console.log(`* ${user.name}`);
    }
  }
};
