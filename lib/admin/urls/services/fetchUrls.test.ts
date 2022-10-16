import axios, { Axios } from "axios";

import { FetchDataType, fetchUrls } from "./fetchUrls";
import { createAdminUrlListItemVM } from "../../../../test/fixtures/adminUrlListItemVM";

vi.mock("axios");

const mockedAxios = vi.mocked<Axios>(axios);

describe("fetchUrls", () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValue([]);
  });

  it("should fetch urls", async () => {
    await fetchUrls();

    expect(mockedAxios.get).toHaveBeenCalledWith("/api/url");
  });

  it("should return fetched urls", async () => {
    const urlList: FetchDataType = [createAdminUrlListItemVM()];
    mockedAxios.get.mockResolvedValue({ data: urlList });

    const fetchedUrls = await fetchUrls();

    expect(fetchedUrls).toEqual(urlList);
  });
});
