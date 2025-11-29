-- AlterTable
ALTER TABLE "events" ADD COLUMN "associationId" TEXT;

-- CreateIndex
CREATE INDEX "events_associationId_idx" ON "events"("associationId");
