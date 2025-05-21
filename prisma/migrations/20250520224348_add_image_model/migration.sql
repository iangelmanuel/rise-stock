/*
  Warnings:

  - You are about to drop the column `image` on the `Clothes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Clothes" DROP COLUMN "image";

-- CreateTable
CREATE TABLE "ClothesImage" (
    "id" TEXT NOT NULL,
    "secureUrl" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "clothesId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClothesImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ClothesImage" ADD CONSTRAINT "ClothesImage_clothesId_fkey" FOREIGN KEY ("clothesId") REFERENCES "Clothes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
