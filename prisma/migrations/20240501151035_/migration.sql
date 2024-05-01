/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Entry` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Entry` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Entry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "type" TEXT NOT NULL,
    "text" TEXT NOT NULL
);
INSERT INTO "new_Entry" ("date", "id", "text", "type") SELECT "date", "id", "text", "type" FROM "Entry";
DROP TABLE "Entry";
ALTER TABLE "new_Entry" RENAME TO "Entry";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
