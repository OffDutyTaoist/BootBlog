// src/config.ts
import fs from "fs";
import os from "os";
import path from "path";

export type Config = {
  dbUrl: string;
  currentUserName?: string;
};

function getConfigFilePath(): string {
  const homeDir = os.homedir();
  return path.join(homeDir, ".gatorconfig.json");
}

function validateConfig(rawConfig: any): Config {
  if (!rawConfig || typeof rawConfig !== "object") {
    throw new Error("Invalid config: not an object");
  }

  if (typeof rawConfig.db_url !== "string") {
    throw new Error("Invalid config: db_url must be a string");
  }

  if (
    "current_user_name" in rawConfig &&
    rawConfig.current_user_name !== undefined &&
    typeof rawConfig.current_user_name !== "string"
  ) {
    throw new Error("Invalid config: current_user_name must be a string");
  }

  const cfg: Config = {
    dbUrl: rawConfig.db_url,
  };

  if (typeof rawConfig.current_user_name === "string") {
    cfg.currentUserName = rawConfig.current_user_name;
  }

  return cfg;
}

function writeConfig(cfg: Config): void {
  const filePath = getConfigFilePath();

  const jsonData = {
    db_url: cfg.dbUrl,
    current_user_name: cfg.currentUserName,
  };

  fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), "utf8");
}

export function readConfig(): Config {
  const filePath = getConfigFilePath();
  const contents = fs.readFileSync(filePath, "utf8");
  const raw = JSON.parse(contents);
  return validateConfig(raw);
}

export function setUser(userName: string, cfg: Config): void {
  const updated: Config = {
    ...cfg,
    currentUserName: userName,
  };

  writeConfig(updated);
}
