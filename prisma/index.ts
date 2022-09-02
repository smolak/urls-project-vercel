import { PrismaClient } from "@prisma/client";
import { generateModelId } from "./middlewares/generateModelId";
import { generateModelIdForSeed } from "./middlewares/generateModelIdForSeed";

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({
    errorFormat: "minimal",
  });
} else {
  // @ts-ignore
  globalThis["prisma"] =
    // @ts-ignore
    globalThis["prisma"] ||
    new PrismaClient({
      errorFormat: "pretty",
    });

  // @ts-ignore
  prisma = globalThis["prisma"];

  console.log("Registering seed middleware...");
  prisma.$use(generateModelIdForSeed);
}

prisma.$use(generateModelId);

export default prisma;
