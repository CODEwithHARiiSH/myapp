/*
  Warnings:

  - You are about to drop the column `genre` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Movie` table. All the data in the column will be lost.
  - Added the required column `directorId` to the `Movie` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Movie_title_key";

-- AlterTable
ALTER TABLE "Movie" DROP COLUMN "genre",
DROP COLUMN "title",
ADD COLUMN     "directorId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Director" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Director_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Movie" ADD CONSTRAINT "Movie_directorId_fkey" FOREIGN KEY ("directorId") REFERENCES "Director"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
