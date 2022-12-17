import { generateId } from "../../shared/utils/generateId";

export const generateApiKey = () => generateId("", 30);
