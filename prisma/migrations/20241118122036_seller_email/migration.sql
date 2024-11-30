/*
  Warnings:

  - You are about to drop the column `seller_id` on the `Product` table. All the data in the column will be lost.
  - Added the required column `seller_email` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_seller_id_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "seller_id",
ADD COLUMN     "seller_email" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_seller_email_fkey" FOREIGN KEY ("seller_email") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
