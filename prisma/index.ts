import { PrismaClient } from "@prisma/client";
import { generateModelId } from "./middlewares/generate-model-id";

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
}

prisma.$use(generateModelId);

export default prisma;
