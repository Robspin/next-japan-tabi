import postgres from "postgres"
import { drizzle } from "drizzle-orm/postgres-js"
import * as schema from "./schema"

// In Next.js, module-level variables are re-created per worker in production.
// This singleton pattern prevents exhausting the connection pool in development
// where hot-reload causes repeated module evaluation.
const globalForDb = globalThis as unknown as { _pgClient: postgres.Sql }

const client =
  globalForDb._pgClient ??
  postgres(process.env.DATABASE_URL!, { max: 10 })

if (process.env.NODE_ENV !== "production") {
  globalForDb._pgClient = client
}

export const db = drizzle(client, { schema })
