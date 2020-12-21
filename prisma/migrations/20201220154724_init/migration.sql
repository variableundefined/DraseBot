-- CreateTable
CREATE TABLE "Users" (
    "id" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "upgradePoints" DECIMAL(65,30) NOT NULL,
    "nitroBoost" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);
