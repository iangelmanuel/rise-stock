/*
  Warnings:

  - Made the column `client` on table `Sale` required. This step will fail if there are existing NULL values in that column.
  - Made the column `note` on table `Sale` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Sale" ALTER COLUMN "client" SET NOT NULL,
ALTER COLUMN "note" SET NOT NULL;
