import { generateId } from "../../shared/utils/generateId";

export const URL_QUEUE_ID_PREFIX = "url_queue_";

export const generateUrlQueueId = () => generateId(URL_QUEUE_ID_PREFIX);
