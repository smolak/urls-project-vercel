import axios, { AxiosError } from "axios";
import { UserProfileData } from "@prisma/client";
import { UsernameCheckResponse } from "../handlers/usernameCheckHandler";

export type UsernameCheckSuccess = UsernameCheckResponse;
export type UsernameCheckFailure = AxiosError;

export const usernameCheck = async (username: UserProfileData["username"]) => {
  const { data } = await axios.post<UsernameCheckSuccess>("/api/username-check", { username });

  return data;
};
