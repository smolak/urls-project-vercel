import { generateId } from "../../shared/utils/generateId";

export const FEED_ID_PREFIX = "feed_";

export const generateFeedId = () => generateId(FEED_ID_PREFIX);
