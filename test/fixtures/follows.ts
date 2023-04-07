import { Follows } from "@prisma/client";
import { generateUserId } from "../../lib/user/utils/generate-user-id";

export const createFollows = (overwrites: Partial<Follows> = {}): Follows => {
  return {
    id: BigInt(1),
    followerId: generateUserId(),
    followingId: generateUserId(),
    createdAt: new Date(),
    ...overwrites,
  };
};
