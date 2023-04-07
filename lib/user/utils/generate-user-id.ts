import { generateId } from "../../shared/utils/generate-id";

export const USER_ID_PREFIX = "usr_";

export const generateUserId = () => generateId(USER_ID_PREFIX);
