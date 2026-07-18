import { neon } from "@neondatabase/serverless"

const databaseUrl = process.env.DATABASE_URL

export const sql = databaseUrl
  ? neon(databaseUrl)
  : (async () => {
      throw new Error("Database connection is disabled: DATABASE_URL is not set")
    })
