/*
  Warnings:

  - Added the required column `displayname` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `photoUrl` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `displayname` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `photoUrl` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "displayname" TEXT NOT NULL,
ADD COLUMN     "photoUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "displayname" TEXT NOT NULL,
ADD COLUMN     "photoUrl" TEXT NOT NULL;
