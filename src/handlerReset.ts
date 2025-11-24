// src/handlerReset.ts

import type { CommandHandler } from "./commands.js";
import { resetUsers } from "./lib/db/queries/reset.js";

export const handlerReset: CommandHandler = async (cmdName, ...args) => {
  try {
    await resetUsers();
    console.log("Database reset: all users deleted.");
  } catch (err: any) {
    console.error("Failed to reset database:", err.message);
    process.exit(1);
  }
};
