import { generateId } from "../../shared/utils/generate-id";

export const FEED_ID_PREFIX = "feed_";

export const generateFeedId = () => generateId(FEED_ID_PREFIX);
