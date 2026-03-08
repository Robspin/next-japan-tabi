import { defineConfig } from "drizzle-kit"
import { config } from "dotenv"

config({ path: ".env.local" })

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    // Use the direct (non-pooled) Neon URL for migrations — drizzle-kit needs postgres protocol.
    // In Neon dashboard: Connection Details → Direct connection
    url: process.env.DATABASE_URL_DIRECT ?? process.env.DATABASE_URL!,
  },
})
