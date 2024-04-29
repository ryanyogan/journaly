import { PrismaClient } from "@prisma/client";

let prisma = new PrismaClient();

process.on("beforeExit", () => {
  prisma.$disconnect();
});

export { prisma };
