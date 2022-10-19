import { JWT } from "next-auth/jwt";
import { generateUserId } from "../../lib/user/utils/generateUserId";
import { User } from "@prisma/client";

interface Token extends JWT {
  role: User["role"];
  picture?: string;
  image?: string;
  iat: number;
  exp: number;
  jti: string;
}

export const createToken = (overwrites: Partial<Token> = {}): Token => ({
  name: "Jacek",
  email: "jacek@email.com",
  picture: "https://picture.url.com/jacek.png",
  sub: generateUserId(),
  role: "USER",
  image: "https://picture.url.com/jacek.png",
  iat: 1664913411,
  exp: 1667505411,
  jti: "9a9b26b7-4d6b-48ea-8550-e629e7946ebc",
  ...overwrites,
});
