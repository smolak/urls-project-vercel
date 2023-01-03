import axios from "axios";
import { AdminUrlListVM } from "../models/AdminUrlList.vm";

export type FetchDataType = AdminUrlListVM;

export const fetchUrls = async () => {
  const { data } = await axios.get<FetchDataType>("/api/url");

  return data;
};
