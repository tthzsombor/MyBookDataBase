/*
  Warnings:

  - You are about to drop the `_bookstogenres` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `genreId` to the `Books` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_bookstogenres` DROP FOREIGN KEY `_BooksToGenres_A_fkey`;

-- DropForeignKey
ALTER TABLE `_bookstogenres` DROP FOREIGN KEY `_BooksToGenres_B_fkey`;

-- DropForeignKey
ALTER TABLE `userbook` DROP FOREIGN KEY `UserBook_userid_fkey`;

-- AlterTable
ALTER TABLE `books` ADD COLUMN `genreId` INTEGER NOT NULL,
    ADD COLUMN `image` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `userbook` ADD COLUMN `opinion` VARCHAR(191) NULL,
    ADD COLUMN `rating` INTEGER NULL;

-- DropTable
DROP TABLE `_bookstogenres`;

-- AddForeignKey
ALTER TABLE `Books` ADD CONSTRAINT `Books_genreId_fkey` FOREIGN KEY (`genreId`) REFERENCES `Genres`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserBook` ADD CONSTRAINT `UserBook_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
