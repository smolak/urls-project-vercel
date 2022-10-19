import axios from "axios";
import { User } from "@prisma/client";

export type FetchDataType = ReadonlyArray<User>;

export const fetchUsers = async () => {
  const { data } = await axios.get<FetchDataType>("/api/user");

  return data;
};
