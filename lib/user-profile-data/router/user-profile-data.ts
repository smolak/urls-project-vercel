import { createTRPCRouter } from "../../../server/api/trpc";
import { getPrivateUserProfileData } from "./procedures/get-private-user-profile-data";
import { usernameCheck } from "./procedures/username-check";
import { updateUserProfileData } from "./procedures/update-user-profile-data";
import { createUserProfileData } from "./procedures/create-user-profile-data";

export const userProfileDataRouter = createTRPCRouter({
  getPrivateUserProfileData,
  usernameCheck,
  updateUserProfileData,
  createUserProfileData,
});
