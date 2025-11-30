-- AlterTable
ALTER TABLE "users" ADD COLUMN "walletAddress" TEXT;

-- CreateTable
CREATE TABLE "donations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "donorWalletAddress" TEXT NOT NULL,
    "associationWalletAddress" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "txHash" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "donations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "donation_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "donationId" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "itemType" TEXT NOT NULL,
    "rarity" TEXT NOT NULL,
    "nftTokenId" TEXT,
    "nftTxHash" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "donation_items_donationId_fkey" FOREIGN KEY ("donationId") REFERENCES "donations" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "blockchain_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "donationId" TEXT,
    "eventId" TEXT,
    "eventContributionId" TEXT,
    "txHash" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "metadata" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "confirmedAt" DATETIME,
    CONSTRAINT "blockchain_events_donationId_fkey" FOREIGN KEY ("donationId") REFERENCES "donations" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "blockchain_events_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "blockchain_events_eventContributionId_fkey" FOREIGN KEY ("eventContributionId") REFERENCES "event_contributions" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "donations_donorWalletAddress_idx" ON "donations"("donorWalletAddress");

-- CreateIndex
CREATE INDEX "donations_associationWalletAddress_idx" ON "donations"("associationWalletAddress");

-- CreateIndex
CREATE INDEX "donations_txHash_idx" ON "donations"("txHash");

-- CreateIndex
CREATE INDEX "donation_items_nftTokenId_idx" ON "donation_items"("nftTokenId");

-- CreateIndex
CREATE INDEX "blockchain_events_txHash_idx" ON "blockchain_events"("txHash");

-- CreateIndex
CREATE INDEX "blockchain_events_type_idx" ON "blockchain_events"("type");
