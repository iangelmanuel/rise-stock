/*
  Warnings:

  - You are about to drop the column `discount` on the `Clothes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Clothes" DROP COLUMN "discount";

-- AlterTable
ALTER TABLE "Sale" ADD COLUMN     "discount" DOUBLE PRECISION NOT NULL DEFAULT 0;
