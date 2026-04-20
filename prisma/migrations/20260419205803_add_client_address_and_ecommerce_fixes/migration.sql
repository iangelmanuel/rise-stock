/*
  Warnings:

  - You are about to drop the column `aditionalData` on the `OrderAddress` table. All the data in the column will be lost.
  - Added the required column `size` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Made the column `orderId` on table `OrderTracking` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "OrderTracking" DROP CONSTRAINT "OrderTracking_orderId_fkey";

-- AlterTable
ALTER TABLE "Clothes" ADD COLUMN     "description" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "itemsInOrder" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "orderDiscountId" TEXT;

-- AlterTable
ALTER TABLE "OrderAddress" DROP COLUMN "aditionalData",
ADD COLUMN     "additionalData" TEXT;

-- AlterTable
ALTER TABLE "OrderDiscount" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "size" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "OrderTracking" ALTER COLUMN "orderId" SET NOT NULL;

-- CreateTable
CREATE TABLE "ClientAddress" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "typeOfIdentification" TEXT NOT NULL,
    "identification" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "address2" TEXT,
    "postalCode" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "additionalData" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clientId" TEXT NOT NULL,

    CONSTRAINT "ClientAddress_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ClientAddress" ADD CONSTRAINT "ClientAddress_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_orderDiscountId_fkey" FOREIGN KEY ("orderDiscountId") REFERENCES "OrderDiscount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderTracking" ADD CONSTRAINT "OrderTracking_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
