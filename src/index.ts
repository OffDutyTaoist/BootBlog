import { readConfig, setUser } from "./config"
import { registerCommand, runCommand } from "./commands.js";
import { handlerLogin } from "./handlerLogin.js";

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error("Error: Not enough arguments provided.");
    process.exit(1);
  }

  const cmdName = args[0];
  const cmdArgs = args.slice(1);

  const registry = {};

  registerCommand(registry, "login", handlerLogin);

  try {
    runCommand(registry, cmdName, ...cmdArgs);
  } catch (err: any) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

main();
