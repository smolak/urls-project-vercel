import { hash } from "argon2";
import prisma from "./index";

async function main() {
  const encryptedPassword = await hash("password1234");
  await prisma.user.upsert({
    where: { email: "a@a.com" },
    update: {},
    create: {
      id: "will-be-generated-by-middleware",
      email: "a@a.com",
      name: "Alice",
      password: encryptedPassword,
    },
  });

  await prisma.user.upsert({
    where: { email: "b@b.com" },
    update: {},
    create: {
      id: "will-be-generated-by-middleware",
      email: "b@b.com",
      name: "Bob",
      password: encryptedPassword,
    },
  });

  await prisma.user.upsert({
    where: { email: "c@c.com" },
    update: {},
    create: {
      id: "will-be-generated-by-middleware",
      email: "c@c.com",
      name: "Carla",
      password: encryptedPassword,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
