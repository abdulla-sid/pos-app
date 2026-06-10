import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3"


const sqlite = new Database(process.env.Database_URL ?? "./dev.db");
export const db = drizzle(sqlite);


