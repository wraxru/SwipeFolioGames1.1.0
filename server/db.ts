import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";
import { MemStorage } from "./storage";

neonConfig.webSocketConstructor = ws;

let storage: MemStorage | null = null;
let pool: Pool | null = null;
let db: any = null;

// Debug info
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("DATABASE_URL:", process.env.DATABASE_URL ? "Set" : "Not set");

// Use in-memory storage for development
if (process.env.NODE_ENV === 'development' || !process.env.DATABASE_URL) {
  console.log("Using in-memory storage for development");
  storage = new MemStorage();
} else {
  console.log("Using database with connection string");
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle({ client: pool, schema });
}

export { storage, pool, db };
