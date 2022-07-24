import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

import { fetchUsers } from "./fetchUsers";
import { User } from "next-auth";

describe("fetchUsers", () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValue([]);
  });

  it("should fetch users", async () => {
    await fetchUsers();

    expect(mockedAxios.get).toHaveBeenCalledWith("/api/user");
  });

  it("should return fetched users", async () => {
    const users: ReadonlyArray<User> = [
      {
        id: "usr_someRandomStringForID",
        role: "user",
        createdAt: new Date().toISOString(),
      },
    ];
    mockedAxios.get.mockResolvedValue({ data: users });

    const fetchedUsers = await fetchUsers();

    expect(fetchedUsers).toEqual(users);
  });
});
