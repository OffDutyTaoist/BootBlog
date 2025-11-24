// src/index.ts

import { registerCommand, runCommand } from "./commands.js";
import { handlerLogin } from "./handlerLogin.js";
import { handlerRegister } from "./handlerRegister.js";
import { handlerReset } from "./handlerReset.js";
import { handlerUsers } from "./handlerUsers.js";
import { handlerAgg } from "./handlerAgg.js";
import { handlerAddFeed } from "./handlerAddFeed.js";

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error("Error: Not enough arguments provided.");
    process.exit(1);
  }

  const cmdName = args[0];
  const cmdArgs = args.slice(1);

  const registry: any = {};

  registerCommand(registry, "login", handlerLogin);
  registerCommand(registry, "register", handlerRegister);
  registerCommand(registry, "reset", handlerReset);
  registerCommand(registry, "users", handlerUsers);
  registerCommand(registry, "agg", handlerAgg);
  registerCommand(registry, "addfeed", handlerAddFeed);

  try {
    await runCommand(registry, cmdName, ...cmdArgs);
  } catch (err: any) {
    console.error("Error:", err.message);
    process.exit(1);
  }

  // Important so the Postgres connection doesn't keep Node alive
  process.exit(0);
}

main();

