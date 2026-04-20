-- AlterTable
ALTER TABLE "Clothes" ADD COLUMN     "discount" DOUBLE PRECISION NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "discount" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "OrderDiscount" ALTER COLUMN "discount" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "OrderItem" ALTER COLUMN "discount" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "Sale" ALTER COLUMN "discount" SET DEFAULT 1;
