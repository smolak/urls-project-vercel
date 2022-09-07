import { generateId } from "../../shared/utils/generateId";

export const ACCOUNT_ID_PREFIX = "acc_";

export const generateAccountId = () => generateId(ACCOUNT_ID_PREFIX);
