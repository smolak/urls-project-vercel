import { useQuery } from "@tanstack/react-query";
import { fetchUsers, FetchDataType } from "../../services/fetchUsers";

export const useUsersQuery = () => useQuery<FetchDataType, Error>(["admin", "users"], () => fetchUsers());
