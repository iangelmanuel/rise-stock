/*
  Warnings:

  - Added the required column `clotheSize` to the `Sale` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sale" ADD COLUMN     "clotheSize" TEXT NOT NULL;
