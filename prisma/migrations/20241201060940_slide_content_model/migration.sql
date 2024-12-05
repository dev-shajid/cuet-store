/*
  Warnings:

  - You are about to drop the column `end_date` on the `Offer` table. All the data in the column will be lost.
  - You are about to drop the column `start_date` on the `Offer` table. All the data in the column will be lost.
  - Added the required column `end_at` to the `Offer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_at` to the `Offer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Offer" DROP COLUMN "end_date",
DROP COLUMN "start_date",
ADD COLUMN     "end_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "start_at" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "SliderContent" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "status" "PublishStatus" NOT NULL DEFAULT 'INACTIVE',
    "start_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SliderContent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SliderContent" ADD CONSTRAINT "SliderContent_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
