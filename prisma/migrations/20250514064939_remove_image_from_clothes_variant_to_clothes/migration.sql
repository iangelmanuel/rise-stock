/*
  Warnings:

  - You are about to drop the column `image` on the `ClothesVariant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Clothes" ADD COLUMN     "image" TEXT;

-- AlterTable
ALTER TABLE "ClothesVariant" DROP COLUMN "image";
