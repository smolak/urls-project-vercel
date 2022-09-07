import { generateId } from "../../shared/utils/generateId";

export const URL_ID_PREFIX = "url_";

export const generateUrlId = () => generateId(URL_ID_PREFIX);
