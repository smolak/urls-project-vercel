import axios from "axios";
import { AdminUrlListVm } from "../models/AdminUrlList.vm";

export type FetchDataType = AdminUrlListVm;

export const fetchUrls = async () => {
  const { data } = await axios.get<FetchDataType>("/api/url");

  return data;
};
