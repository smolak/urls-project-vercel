import { generateId } from "../../shared/utils/generate-id";

export const generateApiKey = () => generateId("", 30);
