import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";
import { MemStorage } from "./storage";

neonConfig.webSocketConstructor = ws;

let storage: MemStorage | null = null;
let pool: Pool | null = null;
let db: any = null;

// Use in-memory storage for development
if (process.env.NODE_ENV === 'development') {
  storage = new MemStorage();
} else {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL must be set. Did you forget to provision a database?",
    );
  }

  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle({ client: pool, schema });
}

export { storage, pool, db };
