import { useQuery } from "@tanstack/react-query";
import { fetchUrls, FetchDataType } from "../services/fetchUrls";

export const useUrlsQuery = () => useQuery<FetchDataType, Error>(["admin", "urls"], () => fetchUrls());
