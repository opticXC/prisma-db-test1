/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Lawyer" DROP CONSTRAINT "Lawyer_userId_fkey";

-- DropForeignKey
ALTER TABLE "Pass" DROP CONSTRAINT "Pass_userId_fkey";

-- DropForeignKey
ALTER TABLE "Query" DROP CONSTRAINT "Query_lawyerId_fkey";

-- DropForeignKey
ALTER TABLE "Query" DROP CONSTRAINT "Query_userId_fkey";

-- AlterTable
ALTER TABLE "Lawyer" ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Pass" ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Query" ALTER COLUMN "userId" SET DATA TYPE TEXT,
ALTER COLUMN "lawyerId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- AddForeignKey
ALTER TABLE "Pass" ADD CONSTRAINT "Pass_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lawyer" ADD CONSTRAINT "Lawyer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Query" ADD CONSTRAINT "Query_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Query" ADD CONSTRAINT "Query_lawyerId_fkey" FOREIGN KEY ("lawyerId") REFERENCES "Lawyer"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
