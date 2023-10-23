-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "avatar" TEXT NOT NULL DEFAULT 'default-avatar.jpg',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pass" (
    "userId" INTEGER NOT NULL,
    "data" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Lawyer" (
    "userId" INTEGER NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "services" TEXT[]
);

-- CreateTable
CREATE TABLE "Query" (
    "queryId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "lawyerId" INTEGER NOT NULL,
    "context" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "Logins" (
    "key" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUsed" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Pass_userId_key" ON "Pass"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Lawyer_userId_key" ON "Lawyer"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Query_queryId_key" ON "Query"("queryId");

-- CreateIndex
CREATE UNIQUE INDEX "Query_userId_lawyerId_key" ON "Query"("userId", "lawyerId");

-- CreateIndex
CREATE UNIQUE INDEX "Logins_key_key" ON "Logins"("key");

-- AddForeignKey
ALTER TABLE "Pass" ADD CONSTRAINT "Pass_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lawyer" ADD CONSTRAINT "Lawyer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Query" ADD CONSTRAINT "Query_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Query" ADD CONSTRAINT "Query_lawyerId_fkey" FOREIGN KEY ("lawyerId") REFERENCES "Lawyer"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
