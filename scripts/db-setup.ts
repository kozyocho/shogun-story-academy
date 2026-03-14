/**
 * Turso (libSQL) 用スキーマセットアップスクリプト
 * `prisma db push` は sqlite プロバイダーが file: URL のみ受け付けるため使えない。
 * このスクリプトで @libsql/client を通じて直接 DDL を実行する。
 * 既存テーブルは変更しない (CREATE TABLE IF NOT EXISTS)。
 */
import { createClient } from "@libsql/client";

const url = process.env.DATABASE_URL;
const authToken = process.env.DATABASE_AUTH_TOKEN;

if (!url) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

// file: URL はローカル dev 用。本番 Turso のみセットアップ対象
if (url.startsWith("file:")) {
  console.log("Local SQLite detected — skipping db-setup (use prisma db push locally)");
  process.exit(0);
}

const client = createClient({ url, authToken });

const statements = [
  `CREATE TABLE IF NOT EXISTS "User" (
    "id"        TEXT NOT NULL PRIMARY KEY,
    "email"     TEXT NOT NULL UNIQUE,
    "name"      TEXT,
    "image"     TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS "Subscription" (
    "id"                   TEXT NOT NULL PRIMARY KEY,
    "userId"               TEXT NOT NULL UNIQUE,
    "stripeCustomerId"     TEXT NOT NULL UNIQUE,
    "stripeSubscriptionId" TEXT UNIQUE,
    "stripePriceId"        TEXT,
    "status"               TEXT NOT NULL DEFAULT 'FREE',
    "currentPeriodEnd"     DATETIME,
    "createdAt"            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"            DATETIME NOT NULL,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
  )`,

  `CREATE TABLE IF NOT EXISTS "Story" (
    "id"          TEXT NOT NULL PRIMARY KEY,
    "slug"        TEXT NOT NULL UNIQUE,
    "title"       TEXT NOT NULL,
    "summary"     TEXT NOT NULL,
    "content"     TEXT NOT NULL,
    "era"         TEXT NOT NULL,
    "figure"      TEXT,
    "isPremium"   INTEGER NOT NULL DEFAULT 0,
    "order"       INTEGER NOT NULL DEFAULT 0,
    "publishedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt"   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   DATETIME NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS "StoryTag" (
    "id"      TEXT NOT NULL PRIMARY KEY,
    "storyId" TEXT NOT NULL,
    "name"    TEXT NOT NULL,
    FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE CASCADE
  )`,

  `CREATE TABLE IF NOT EXISTS "VocabularyNote" (
    "id"           TEXT NOT NULL PRIMARY KEY,
    "storyId"      TEXT NOT NULL,
    "term"         TEXT NOT NULL,
    "reading"      TEXT,
    "definition"   TEXT NOT NULL,
    "culturalNote" TEXT,
    FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE CASCADE
  )`,

  `CREATE TABLE IF NOT EXISTS "ComprehensionQuestion" (
    "id"       TEXT NOT NULL PRIMARY KEY,
    "storyId"  TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "options"  TEXT NOT NULL,
    "answer"   INTEGER NOT NULL,
    FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE CASCADE
  )`,

  `CREATE TABLE IF NOT EXISTS "TimelineEvent" (
    "id"          TEXT NOT NULL PRIMARY KEY,
    "storyId"     TEXT NOT NULL UNIQUE,
    "year"        INTEGER NOT NULL,
    "title"       TEXT NOT NULL,
    "description" TEXT NOT NULL,
    FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE CASCADE
  )`,

  `CREATE TABLE IF NOT EXISTS "StoryProgress" (
    "id"          TEXT NOT NULL PRIMARY KEY,
    "userId"      TEXT NOT NULL,
    "storyId"     TEXT NOT NULL,
    "completed"   INTEGER NOT NULL DEFAULT 0,
    "completedAt" DATETIME,
    FOREIGN KEY ("userId")  REFERENCES "User"("id")  ON DELETE CASCADE,
    FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE CASCADE
  )`,

  `CREATE UNIQUE INDEX IF NOT EXISTS "StoryProgress_userId_storyId_key"
    ON "StoryProgress"("userId", "storyId")`,
];

async function main() {
  console.log("Setting up Turso database schema...");
  for (const sql of statements) {
    await client.execute(sql);
  }
  console.log("Database schema setup complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
