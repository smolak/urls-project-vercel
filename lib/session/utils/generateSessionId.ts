import { generateId } from "../../shared/utils/generateId";

export const SESSION_ID_PREFIX = "ses_";

export const generateSessionId = () => generateId(SESSION_ID_PREFIX);
