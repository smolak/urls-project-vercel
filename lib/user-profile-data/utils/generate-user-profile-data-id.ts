import { generateId } from "../../shared/utils/generate-id";

export const USER_PROFILE_DATA_ID_PREFIX = "usr_pd_";

export const generateUserProfileDataId = () => generateId(USER_PROFILE_DATA_ID_PREFIX);
