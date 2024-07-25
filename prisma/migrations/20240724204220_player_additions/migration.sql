/*
  Warnings:

  - Added the required column `country` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locRank` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pfp` to the `Player` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Player` ADD COLUMN `country` VARCHAR(191) NOT NULL,
    ADD COLUMN `locRank` INTEGER NOT NULL,
    ADD COLUMN `pfp` VARCHAR(191) NOT NULL;
