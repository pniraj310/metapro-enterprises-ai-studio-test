import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  schemaFilter: ["public"],
  dbCredentials: databaseUrl
    ? {
        url: databaseUrl,
      }
    : {
        host: process.env.SQL_HOST || "localhost",
        user: process.env.SQL_ADMIN_USER || "postgres",
        password: process.env.SQL_ADMIN_PASSWORD || "1234",
        database: process.env.SQL_DB_NAME || "metapro_db",
        port: Number(process.env.SQL_PORT || 5432),
        ssl: false,
      },
  verbose: true,
});