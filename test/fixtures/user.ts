import { User } from "@prisma/client";
import { generateUserId } from "../../lib/user/utils/generateUserId";
import { generateId } from "../../lib/shared/utils/generateId";

export const createUser = (overwrites: Partial<User> = {}): User => ({
  id: generateUserId(),
  createdAt: new Date(),
  updatedAt: new Date(),
  name: "Jacek",
  email: "jacek@mail.com",
  emailVerified: new Date(),
  password: generateId(),
  image: "https://s.gravatar.com/avatar/b4b8160fad763019bb200ba1380b9f34?s=80",
  role: "user",
  apiKey: generateId(),
  ...overwrites,
});
