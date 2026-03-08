import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "./schema"

// During `next build`, environment variables are not injected by Deno Deploy.
// neon() validates the URL format at initialisation but only opens a connection
// when a query is executed, so a build-time placeholder is safe — it will never
// be called during the build, only at runtime when DATABASE_URL is set.
const sql = neon(
  process.env.DATABASE_URL ?? "postgresql://placeholder:placeholder@placeholder.neon.tech/placeholder"
)

export const db = drizzle(sql, { schema })
