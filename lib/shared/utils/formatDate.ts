import { format } from "date-fns";

export const formatDate = (date: Date | number) => format(new Date(date), "yyyy-MM-dd'T'HH:mm:ss");
