// src/lib/db/queries/reset.ts

import { db } from "..";
import { users } from "../schema";

export async function resetUsers(): Promise<void> {
  await db.delete(users);
}
