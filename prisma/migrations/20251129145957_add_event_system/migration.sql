-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "currentHealth" INTEGER NOT NULL DEFAULT 1000,
    "maxHealth" INTEGER NOT NULL DEFAULT 1000,
    "multiplier" REAL NOT NULL DEFAULT 2.0,
    "startDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" DATETIME,
    "rewardNFT" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "event_contributions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "userId" TEXT,
    "walletAddress" TEXT NOT NULL,
    "packType" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "damage" INTEGER NOT NULL,
    "tickets" INTEGER NOT NULL,
    "txHash" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "event_contributions_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "heroes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "rarity" TEXT NOT NULL,
    "eventId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "hero_ownerships" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "heroId" TEXT NOT NULL,
    "userId" TEXT,
    "walletAddress" TEXT NOT NULL,
    "nftTokenId" TEXT,
    "acquiredAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "hero_ownerships_heroId_fkey" FOREIGN KEY ("heroId") REFERENCES "heroes" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "event_contributions_eventId_idx" ON "event_contributions"("eventId");

-- CreateIndex
CREATE INDEX "event_contributions_walletAddress_idx" ON "event_contributions"("walletAddress");

-- CreateIndex
CREATE INDEX "hero_ownerships_walletAddress_idx" ON "hero_ownerships"("walletAddress");
