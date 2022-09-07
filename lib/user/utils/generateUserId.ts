import { generateId } from "../../shared/utils/generateId";

export const USER_ID_PREFIX = "usr_";

export const generateUserId = () => generateId(USER_ID_PREFIX);
