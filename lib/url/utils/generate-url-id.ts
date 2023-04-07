import { generateId } from "../../shared/utils/generate-id";

export const URL_ID_PREFIX = "url_";

export const generateUrlId = () => generateId(URL_ID_PREFIX);
