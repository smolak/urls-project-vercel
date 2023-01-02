import { generateId } from "../../shared/utils/generateId";

export const REQUEST_ID_PREFIX = "req_";

export const generateRequestId = () => generateId(REQUEST_ID_PREFIX);
export type RequestId = ReturnType<typeof generateRequestId>;
