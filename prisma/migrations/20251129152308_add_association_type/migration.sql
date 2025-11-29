-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_associations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL DEFAULT 'nature',
    "address" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "logo" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "walletAddress" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "associations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_associations" ("address", "createdAt", "description", "id", "logo", "name", "phone", "status", "updatedAt", "userId", "walletAddress", "website") SELECT "address", "createdAt", "description", "id", "logo", "name", "phone", "status", "updatedAt", "userId", "walletAddress", "website" FROM "associations";
DROP TABLE "associations";
ALTER TABLE "new_associations" RENAME TO "associations";
CREATE UNIQUE INDEX "associations_userId_key" ON "associations"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
