import { createTRPCRouter } from "../../../server/api/trpc";
import { getPrivateUserProfileData } from "./procedures/get-private-user-profile-data";
import { usernameCheck } from "./procedures/username-check";
import { saveUserProfileData } from "./procedures/save-user-profile-data";

export const userProfileDataRouter = createTRPCRouter({
  getPrivateUserProfileData,
  usernameCheck,
  saveUserProfileData,
});
