// src/index.ts

import {
  registerCommand,
  runCommand,
  type CommandsRegistry,
  middlewareLoggedIn,
} from "./commands.js";
import { handlerLogin } from "./handlerLogin.js";
import { handlerRegister } from "./handlerRegister.js";
import { handlerReset } from "./handlerReset.js";
import { handlerUsers } from "./handlerUsers.js";
import { handlerAddFeed } from "./handlerAddFeed.js";
import { handlerFeeds } from "./handlerFeeds.js";
import { handlerFollow } from "./handlerFollow.js";
import { handlerFollowing } from "./handlerFollowing.js";
import { handlerAgg } from "./handlerAgg.js";
import { handlerUnfollow } from "./handlerUnfollow.js";
import { handlerBrowse } from "./handlerBrowse.js";

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error("Error: Not enough arguments provided.");
    process.exit(1);
  }

  const cmdName = args[0];
  const cmdArgs = args.slice(1);

  const registry: CommandsRegistry = {};

  registerCommand(registry, "login", handlerLogin);
  registerCommand(registry, "register", handlerRegister);
  registerCommand(registry, "reset", handlerReset);
  registerCommand(registry, "users", handlerUsers);
  registerCommand(registry, "feeds", handlerFeeds);
  registerCommand(registry, "agg", handlerAgg);

  // Commands that require a logged-in user:
  registerCommand(registry, "addfeed", middlewareLoggedIn(handlerAddFeed));
  registerCommand(registry, "follow", middlewareLoggedIn(handlerFollow));
  registerCommand(registry, "following", middlewareLoggedIn(handlerFollowing));
  registerCommand(registry, "unfollow", middlewareLoggedIn(handlerUnfollow));
  registerCommand(registry, "browse", middlewareLoggedIn(handlerBrowse));

  try {
    await runCommand(registry, cmdName, ...cmdArgs);
  } catch (err: any) {
    console.error("Error:", err.message);
    process.exit(1);
  }

  process.exit(0);
}

main();

