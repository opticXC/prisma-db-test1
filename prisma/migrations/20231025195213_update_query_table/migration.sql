/*
  Warnings:

  - The primary key for the `Query` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `active` on the `Query` table. All the data in the column will be lost.
  - You are about to drop the column `queryId` on the `Query` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `Query` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Query_queryId_key";

-- AlterTable
ALTER TABLE "Query" DROP CONSTRAINT "Query_pkey",
DROP COLUMN "active",
DROP COLUMN "queryId",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "status" INTEGER NOT NULL DEFAULT 0,
ADD CONSTRAINT "Query_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Query_id_key" ON "Query"("id");
