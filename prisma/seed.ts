import { hash } from "argon2";
import prisma from "./index";
import { ID_PLACEHOLDER_REPLACED_BY_ID_GENERATOR } from "./middlewares/generate-model-id";

async function main() {
  const encryptedPassword = await hash("password1234");
  await prisma.user.upsert({
    where: { email: "a@a.com" },
    update: {},
    create: {
      id: ID_PLACEHOLDER_REPLACED_BY_ID_GENERATOR,
      email: "a@a.com",
      name: "Alice",
      password: encryptedPassword,
    },
  });

  await prisma.user.upsert({
    where: { email: "b@b.com" },
    update: {},
    create: {
      id: ID_PLACEHOLDER_REPLACED_BY_ID_GENERATOR,
      email: "b@b.com",
      name: "Bob",
      password: encryptedPassword,
    },
  });

  await prisma.user.upsert({
    where: { email: "c@c.com" },
    update: {},
    create: {
      id: ID_PLACEHOLDER_REPLACED_BY_ID_GENERATOR,
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
