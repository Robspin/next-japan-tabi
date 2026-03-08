import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "./schema"

// neon() communicates over HTTP — no TCP sockets, works in any edge runtime.
// No singleton/connection-pool management needed.
const sql = neon(process.env.DATABASE_URL!)

export const db = drizzle(sql, { schema })
